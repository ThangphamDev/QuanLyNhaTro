import { Router } from 'express';
import { Property, Room, RoomImage, Asset, AssetType } from '../models/index.js';
import { Op } from 'sequelize';

const router = Router();

// Trang chủ: một số phòng nổi bật (đơn giản: phòng còn trống mới nhất)
router.get('/featured', async (_req, res) => {
  const rooms = await Room.findAll({
    where: { status: 'available' },
    limit: 6,
    order: [['createdAt', 'DESC']],
    include: [
      { model: Property },
      { model: RoomImage },
      { model: Asset, include: [AssetType] }
    ],
  }).catch(() => []);
  res.json(rooms);
});

// Danh sách phòng còn trống + filter
router.get('/rooms', async (req, res) => {
  const { property_id, min_price, max_price, min_area, max_area, include_all, status } = req.query;
  const where = {};
  // By default return available rooms only, unless include_all truthy or specific status provided
  if (!include_all && !status) {
    where.status = 'available';
  }
  if (status) where.status = status; // allow explicit status filter
  if (property_id) where.property_id = property_id;
  if (min_price || max_price) where.rent_price = {
    ...(min_price ? { [Op.gte]: Number(min_price) } : {}),
    ...(max_price ? { [Op.lte]: Number(max_price) } : {}),
  };
  if (min_area || max_area) where.area = {
    ...(min_area ? { [Op.gte]: Number(min_area) } : {}),
    ...(max_area ? { [Op.lte]: Number(max_area) } : {}),
  };
  try {
    const rooms = await Room.findAll({
      where,
      include: [
        { model: Property },
        { model: RoomImage },
        { model: Asset, include: [AssetType] }
      ]
    });
    res.json(rooms);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Chi tiết phòng
router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [
        { model: Property },
        { model: RoomImage },
        { 
          model: Asset, 
          include: [AssetType],
          where: { room_id: req.params.id },
          required: false // LEFT JOIN để không bỏ qua room không có asset
        }
      ]
    });
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(room);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Danh sách khu trọ
router.get('/properties', async (_req, res) => {
  try {
    const props = await Property.findAll();
    res.json(props);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


