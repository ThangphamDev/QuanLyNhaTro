import { Router } from 'express';
import { Op } from 'sequelize';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { Property, Room, RoomImage, AssetType, Asset, User, Role, Contract, Invoice, InvoiceItem, UtilityMeter, UtilityReading, Payment, Report } from '../models/index.js';

const router = Router();
router.use(authenticateJWT, authorizeRoles('admin'));

// Helpers
const toIntOrNull = (val) => {
  if (val === undefined || val === null) return null;
  if (typeof val === 'string' && val.trim() === '') return null;
  const n = Number(val);
  return Number.isInteger(n) ? n : null;
};

const toDateOnly = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const endOfMonth = (year, month) => {
  // month: 1-12
  const dt = new Date(Number(year), Number(month), 0);
  return dt;
};

// Normalize various shapes of "assets" payload from multipart forms into an array of numeric IDs
const parseAssets = (raw) => {
  const ids = new Set();
  const pushId = (v) => {
    const n = Number(v);
    if (Number.isInteger(n)) ids.add(n);
  };
  const handle = (item) => {
    if (item === undefined || item === null) return;
    if (Array.isArray(item)) {
      item.forEach(handle);
      return;
    }
    if (typeof item === 'string') {
      const s = item.trim();
      if (!s) return; // ignore empty strings
      try {
        const parsed = JSON.parse(s);
        handle(parsed);
      } catch {
        // not JSON; maybe a single numeric string
        pushId(s);
      }
      return;
    }
    if (typeof item === 'object') {
      if ('id' in item) pushId(item.id);
      return;
    }
    if (typeof item === 'number') pushId(item);
  };
  handle(raw);
  return Array.from(ids);
};

// --- Room status helpers: keep room.status in sync with contracts ---
const markRoomOccupied = async (roomId) => {
  if (!roomId) return;
  try {
    await Room.update({ status: 'occupied' }, { where: { id: roomId } });
  } catch {}
};

const recalcRoomStatus = async (roomId) => {
  if (!roomId) return;
  try {
    const activeCount = await Contract.count({ where: { room_id: roomId, status: 'active' } });
    const next = activeCount > 0 ? 'occupied' : 'available';
    await Room.update({ status: next }, { where: { id: roomId } });
  } catch {}
};

// Dashboard numbers (simplified)
router.get('/dashboard', async (_req, res) => {
  try {
    const [roomsEmpty, roomsOccupied, reportsNew] = await Promise.all([
      Room.count({ where: { status: 'available' } }),
      Room.count({ where: { status: 'occupied' } }),
      Report.count({ where: { status: 'new' } }),
    ]);
    // Revenue month (sum invoices paid of current month)
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const paidInvoices = await Invoice.findAll({ where: { status: 'paid', billing_month: month, billing_year: year } });
    const revenue = paidInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    res.json({ revenue_month: revenue, rooms_available: roomsEmpty, rooms_occupied: roomsOccupied, reports_new: reportsNew });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD Properties
router.post('/properties', async (req, res) => {
  const created = await Property.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Tạo khu trọ thất bại' });
  res.status(201).json(created);
});

router.get('/properties', async (_req, res) => {
  const list = await Property.findAll();
  res.json(list);
});

router.put('/properties/:id', async (req, res) => {
  const p = await Property.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Không tìm thấy' });
  await p.update(req.body);
  res.json(p);
});

router.delete('/properties/:id', async (req, res) => {
  const p = await Property.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Không tìm thấy' });
  await p.destroy();
  res.json({ success: true });
});

// Rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        { model: Property },
        { model: RoomImage },
        { model: Asset, include: [AssetType] }
      ]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [
        { model: Property },
        { model: RoomImage },
        { model: Asset, include: [AssetType] }
      ]
    });
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/rooms', upload.array('images', 10), async (req, res) => {
  try {
    const { assets, defaultImageIndex, ...roomData } = req.body;
  // Normalize assets coming from multipart
  const assetIds = parseAssets(assets);

    const room = await Room.create(roomData);

    // Upload images
    if (req.files && req.files.length > 0) {
      const defaultIndex = parseInt(defaultImageIndex) || 0;
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await RoomImage.create({
          room_id: room.id,
          image_url: `/uploads/${file.filename}`,
          is_primary: i === defaultIndex
        });
      }
    }

    // Link existing assets to the room
    if (assetIds.length > 0) {
      const roomId = Number(room.id);
      if (!Number.isInteger(roomId)) {
        return res.status(400).json({ message: 'ID phòng không hợp lệ' })
      }
      for (const assetId of assetIds) {
        const existingAsset = await Asset.findByPk(assetId);
        if (existingAsset) {
          await existingAsset.update({
            room_id: roomId,
            status: 'in_use'
          });
        }
      }
    }

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(400).json({ message: 'Tạo phòng thất bại' });
  }
});

router.put('/rooms/:id', upload.array('images', 10), async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy' });

    const { assets, defaultImageIndex, imagesToDelete, existingImages, ...roomData } = req.body;
    await room.update(roomData);

    // Handle images to delete
    if (imagesToDelete) {
      try {
        const idsToDelete = typeof imagesToDelete === 'string' ? JSON.parse(imagesToDelete) : imagesToDelete;
        if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
          // TODO: Delete physical files
          await RoomImage.destroy({ where: { id: idsToDelete } });
        }
      } catch (e) {
        console.error('Image deletion error:', e);
      }
    }

    // Update existing images (especially default status)
    if (existingImages) {
      try {
        const images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(images)) {
          for (const img of images) {
            await RoomImage.update(
              { is_primary: img.is_default || false },
              { where: { id: img.id } }
            );
          }
        }
      } catch (e) {
        console.error('Existing images update error:', e);
      }
    }

    // Add new images if provided
    if (req.files && req.files.length > 0) {
      const defaultIndex = parseInt(defaultImageIndex) || 0;
      
      // If no existing images and no existing default, make first new image default
      const existingDefaultImage = await RoomImage.findOne({ 
        where: { room_id: room.id, is_primary: true } 
      });
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const isPrimary = !existingDefaultImage && i === defaultIndex;
        
        await RoomImage.create({
          room_id: room.id,
          image_url: `/uploads/${file.filename}`,
          is_primary: isPrimary
        });
      }
    }

    // Update assets if provided
    if (assets !== undefined) {
      try {
        const assetIds = parseAssets(assets);
        const roomId = Number(room.id);
        if (!Number.isInteger(roomId)) {
          return res.status(400).json({ message: 'ID phòng không hợp lệ' })
        }
        // Unlink all current assets from this room
        await Asset.update(
          { room_id: null, status: 'in_storage' },
          { where: { room_id: roomId } }
        );
        // Then link the new assets to this room
        for (const assetId of assetIds) {
          const existingAsset = await Asset.findByPk(assetId);
          if (existingAsset) {
            await existingAsset.update({
              room_id: roomId,
              status: 'in_use'
            });
          }
        }
      } catch (e) {
        console.error('Asset update error:', e);
      }
    }

    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/rooms/:id', async (req, res) => {
  const r = await Room.findByPk(req.params.id);
  if (!r) return res.status(404).json({ message: 'Không tìm thấy' });
  await r.destroy();
  res.json({ success: true });
});

// Asset types
router.post('/asset-types', async (req, res) => {
  const created = await AssetType.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Tạo loại tài sản thất bại' });
  res.status(201).json(created);
});

router.get('/asset-types', async (_req, res) => {
  const list = await AssetType.findAll();
  res.json(list);
});

router.put('/asset-types/:id', async (req, res) => {
  const assetType = await AssetType.findByPk(req.params.id);
  if (!assetType) return res.status(404).json({ message: 'Không tìm thấy loại tài sản' });
  await assetType.update(req.body);
  res.json(assetType);
});

router.delete('/asset-types/:id', async (req, res) => {
  const assetType = await AssetType.findByPk(req.params.id);
  if (!assetType) return res.status(404).json({ message: 'Không tìm thấy loại tài sản' });
  await assetType.destroy();
  res.json({ success: true });
});

// Assets
router.get('/assets', async (req, res) => {
  const { room_id } = req.query;
  const parsedRoomId = toIntOrNull(room_id);
  const where = parsedRoomId !== null ? { room_id: parsedRoomId } : {};
  try {
    const assets = await Asset.findAll({
      where,
      include: [AssetType, Room, Property]
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Available assets: assets not linked to any room (in storage)
router.get('/available-assets', async (_req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { room_id: null },
      include: [AssetType, Property]
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/assets', async (req, res) => {
  try {
    const body = { ...req.body };
    const roomId = toIntOrNull(body.room_id);
    body.room_id = roomId;
    // If not assigned to a room, default status to in_storage
    if (roomId === null) {
      body.status = body.status || 'in_storage';
    } else {
      body.status = body.status || 'in_use';
    }
    const created = await Asset.create(body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Tạo tài sản thất bại' });
  }
});

// Room Images management
router.delete('/room-images/:id', async (req, res) => {
  try {
    const image = await RoomImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    
    // Delete physical file
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'uploads', path.basename(image.image_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.error('Error deleting physical file:', fileError);
    }
    
    await image.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set image as primary/default
router.put('/room-images/:id/set-primary', async (req, res) => {
  try {
    const image = await RoomImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    
    // Remove primary status from all other images of the same room
    await RoomImage.update(
      { is_primary: false },
      { where: { room_id: image.room_id } }
    );
    
    // Set this image as primary
    await image.update({ is_primary: true });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Set primary image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/assets/:id', async (req, res) => {
  const a = await Asset.findByPk(req.params.id);
  if (!a) return res.status(404).json({ message: 'Không tìm thấy' });
  const body = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(body, 'room_id')) {
    const roomId = toIntOrNull(body.room_id);
    body.room_id = roomId;
    // Auto adjust status based on assignment if not explicitly provided
    if (!body.status) {
      body.status = roomId === null ? 'in_storage' : 'in_use';
    }
  }
  await a.update(body);
  res.json(a);
});

router.delete('/assets/:id', async (req, res) => {
  const a = await Asset.findByPk(req.params.id);
  if (!a) return res.status(404).json({ message: 'Không tìm thấy' });
  await a.destroy();
  res.json({ success: true });
});

// Bulk create assets with quantity
router.post('/assets/bulk', async (req, res) => {
  try {
    const { asset_type_id, property_id, name, purchase_date, warranty_end_date, value, notes } = req.body;
    const quantity = parseInt(req.body.quantity || 1);

    if (!asset_type_id || !property_id || !name || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc hoặc số lượng không hợp lệ' });
    }

    // Get asset type to generate prefix
    const assetType = await AssetType.findByPk(asset_type_id);
    if (!assetType) {
      return res.status(404).json({ message: 'Không tìm thấy loại tài sản' });
    }

    // Generate prefix from asset type name (first 3 characters, fallback to 'AST')
    const base = (assetType.name || 'AST').toString();
    const prefix = base.substring(0, 3).toUpperCase();

    // Get the highest serial number for this prefix
    const lastAsset = await Asset.findOne({
      where: { serial_number: { [Op.like]: `${prefix}%` } },
      order: [['serial_number', 'DESC']]
    });

    let nextNumber = 1;
    if (lastAsset && lastAsset.serial_number) {
      const matched = String(lastAsset.serial_number).replace(prefix, '');
      const lastNumber = parseInt(matched, 10);
      if (Number.isFinite(lastNumber)) nextNumber = lastNumber + 1;
    }

    // Build unit items (quantity rows, each quantity=1 and unique serial)
    const items = [];
    for (let i = 0; i < quantity; i++) {
      const serialNumber = `${prefix}${(nextNumber + i).toString().padStart(3, '0')}`;
      items.push({
        property_id,
        asset_type_id,
        name,
        serial_number: serialNumber,
        quantity: 1,
        purchase_date,
        warranty_end_date,
        value,
        notes,
        status: 'in_storage',
      });
    }

    const created = await Asset.bulkCreate(items);

    res.status(201).json({ quantity: created.length, items: created });
  } catch (error) {
    console.error('Bulk create assets error:', error);
    res.status(500).json({ message: 'Tạo tài sản thất bại' });
  }
});

// Tenants
router.get('/tenants', async (_req, res) => {
  const tenants = await User.findAll({
    include: [{ model: Role, where: { role_name: 'tenant' } }],
  });
  res.json(tenants);
});

// Contracts
router.get('/contracts', async (_req, res) => {
  const contracts = await Contract.findAll({
    include: [
      { model: Room, include: [Property] },
      { model: User, as: 'tenant' }
    ]
  });
  res.json(contracts);
});

router.post('/contracts', async (req, res) => {
  try {
    const created = await Contract.create(req.body);
    // If contract is active, mark the room as occupied
    if (created && created.status === 'active') {
      await markRoomOccupied(created.room_id);
    }
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Tạo hợp đồng thất bại' });
  }
});

router.put('/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });

    const prevRoomId = contract.room_id;
    const prevStatus = contract.status;
    const nextRoomId = req.body.room_id !== undefined ? req.body.room_id : prevRoomId;
    const nextStatus = req.body.status !== undefined ? req.body.status : prevStatus;

    await contract.update(req.body);

    // If room changed, recalc previous and apply to new
    if (nextRoomId !== prevRoomId) {
      // free previous room if no more active contracts
      await recalcRoomStatus(prevRoomId);
    }

    // If active now, ensure occupied; otherwise recalc
    if (nextStatus === 'active') {
      await markRoomOccupied(nextRoomId);
    } else {
      await recalcRoomStatus(nextRoomId);
    }

    res.json(contract);
  } catch (e) {
    res.status(400).json({ message: 'Cập nhật hợp đồng thất bại' });
  }
});

// Confirm/Unconfirm contract signature
// Admin terminate contract
router.post('/contracts/:id/terminate', async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    await contract.update({ status: 'terminated', end_date: req.body.end_date || new Date() });
    // Recalculate room status after termination
    await recalcRoomStatus(contract.room_id);
    res.json(contract);
  } catch (e) {
    res.status(400).json({ message: 'Chấm dứt hợp đồng thất bại' });
  }
});

router.delete('/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    const roomId = contract.room_id;
    await contract.destroy();
    // Recalculate room status in case it was the last active contract
    await recalcRoomStatus(roomId);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Xóa hợp đồng thất bại' });
  }
});

// Finance: invoices + items + payments
router.get('/invoices', async (_req, res) => {
  const invoices = await Invoice.findAll({
    include: [
      { model: Contract, include: [{ model: Room, include: [Property] }, { model: User, as: 'tenant' }] },
      { model: InvoiceItem, as: 'invoice_items' }
    ]
  });
  res.json(invoices);
});

router.post('/invoices', async (req, res) => {
  try {
    const {
      contract_id,
      total_amount,
      billing_month,
      billing_year,
      status,
      issue_date,
      due_date,
      electricity_old,
      electricity_new,
      electricity_rate,
      water_old,
      water_new,
      water_rate,
    } = req.body;

    const contractId = toIntOrNull(contract_id);
    const month = toIntOrNull(billing_month);
    const year = toIntOrNull(billing_year);
    const amount = Number(total_amount);

    if (!contractId || !month || !year || !Number.isFinite(amount)) {
      return res.status(400).json({ message: 'Thiếu hoặc sai dữ liệu: contract_id, total_amount, billing_month, billing_year' });
    }

    // Kiểm tra xem hợp đồng đã có hóa đơn chưa thanh toán chưa
    const existingUnpaidInvoice = await Invoice.findOne({
      where: {
        contract_id: contractId,
        status: { [Op.ne]: 'paid' } // Không phải 'paid'
      }
    });

    if (existingUnpaidInvoice) {
      return res.status(400).json({ 
        message: 'Hợp đồng này đã có hóa đơn chưa thanh toán. Vui lòng thanh toán hóa đơn trước khi tạo hóa đơn mới.' 
      });
    }

    // Tính toán chi phí điện nước
    const electricityOld = Number(electricity_old) || 0;
    const electricityNew = Number(electricity_new) || 0;
    const electricityRate = Number(electricity_rate) || 4000;
    const electricityCost = Math.max(0, (electricityNew - electricityOld) * electricityRate);

    const waterOld = Number(water_old) || 0;
    const waterNew = Number(water_new) || 0;
    const waterRate = Number(water_rate) || 15000;
    const waterCost = Math.max(0, (waterNew - waterOld) * waterRate);

    // Lấy thông tin hợp đồng để tính tiền phòng
    const contract = await Contract.findByPk(contractId, {
      include: [{ model: Room }]
    });
    
    if (!contract) {
      return res.status(400).json({ message: 'Không tìm thấy hợp đồng' });
    }

    const roomFee = Number(contract.rent_price) || 0;
    const calculatedTotal = roomFee + electricityCost + waterCost;

    const payload = {
      contract_id: contractId,
      total_amount: calculatedTotal,
      billing_month: month,
      billing_year: year,
      status: status || 'pending',
      issue_date: issue_date ? toDateOnly(issue_date) : toDateOnly(new Date()),
      due_date: due_date ? toDateOnly(due_date) : toDateOnly(endOfMonth(year, month)),
      // Lưu thông tin điện nước vào invoice_items
    };

    const created = await Invoice.create(payload);
    console.log('Invoice created:', created.id);

    // Tạo invoice items cho từng khoản
    const invoiceItems = [];
    
    // Tiền phòng
    if (roomFee > 0) {
      invoiceItems.push({
        invoice_id: created.id,
        description: 'Tiền thuê phòng',
        amount: roomFee
      });
    }

    // Tiền điện
    if (electricityCost > 0) {
      invoiceItems.push({
        invoice_id: created.id,
        description: `Điện: ${electricityOld} → ${electricityNew} kWh (${electricityRate.toLocaleString()} VND/kWh)`,
        amount: electricityCost
      });
    }

    // Tiền nước
    if (waterCost > 0) {
      invoiceItems.push({
        invoice_id: created.id,
        description: `Nước: ${waterOld} → ${waterNew} m³ (${waterRate.toLocaleString()} VND/m³)`,
        amount: waterCost
      });
    }

    // Tạo các invoice items
    if (invoiceItems.length > 0) {
      const createdItems = await InvoiceItem.bulkCreate(invoiceItems);
      console.log('Invoice items created:', createdItems.length);
    }

    // Lưu chỉ số mới vào utility_readings nếu có
    if (electricityNew > 0 || waterNew > 0) {
      const room = contract.Room;
      if (room) {
        // Lưu chỉ số điện
        if (electricityNew > 0) {
          const electricityMeter = await UtilityMeter.findOne({
            where: { room_id: room.id, meter_type: 'electricity' }
          });
          if (electricityMeter) {
            await UtilityReading.create({
              meter_id: electricityMeter.id,
              reading_value: electricityNew,
              reading_timestamp: new Date()
            });
          }
        }

        // Lưu chỉ số nước
        if (waterNew > 0) {
          const waterMeter = await UtilityMeter.findOne({
            where: { room_id: room.id, meter_type: 'water' }
          });
          if (waterMeter) {
            await UtilityReading.create({
              meter_id: waterMeter.id,
              reading_value: waterNew,
              reading_timestamp: new Date()
            });
          }
        }
      }
    }

    res.status(201).json(created);
  } catch (e) {
    console.error('Create invoice error:', e);
    res.status(400).json({ message: 'Tạo hóa đơn thất bại' });
  }
});

router.put('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    
    const {
      contract_id,
      total_amount,
      billing_month,
      billing_year,
      status,
      issue_date,
      due_date,
      electricity_old,
      electricity_new,
      electricity_rate,
      water_old,
      water_new,
      water_rate,
    } = req.body;

    // Tính toán chi phí điện nước
    const electricityOld = Number(electricity_old) || 0;
    const electricityNew = Number(electricity_new) || 0;
    const electricityRate = Number(electricity_rate) || 4000;
    const electricityCost = Math.max(0, (electricityNew - electricityOld) * electricityRate);

    const waterOld = Number(water_old) || 0;
    const waterNew = Number(water_new) || 0;
    const waterRate = Number(water_rate) || 15000;
    const waterCost = Math.max(0, (waterNew - waterOld) * waterRate);

    // Lấy thông tin hợp đồng để tính tiền phòng
    const contractId = toIntOrNull(contract_id) || invoice.contract_id;
    const contract = await Contract.findByPk(contractId, {
      include: [{ model: Room }]
    });
    
    if (!contract) {
      return res.status(400).json({ message: 'Không tìm thấy hợp đồng' });
    }

    const roomFee = Number(contract.rent_price) || 0;
    const calculatedTotal = roomFee + electricityCost + waterCost;

    // Cập nhật hóa đơn
    const updateData = {
      contract_id: contractId,
      total_amount: calculatedTotal,
      billing_month: toIntOrNull(billing_month) || invoice.billing_month,
      billing_year: toIntOrNull(billing_year) || invoice.billing_year,
      status: status || invoice.status,
      issue_date: issue_date ? toDateOnly(issue_date) : invoice.issue_date,
      due_date: due_date ? toDateOnly(due_date) : invoice.due_date,
    };

    // If month/year changed and due_date not provided, recalc to end of that month
    if (!updateData.due_date && updateData.billing_month && updateData.billing_year) {
      updateData.due_date = toDateOnly(endOfMonth(updateData.billing_year, updateData.billing_month));
    }

    await invoice.update(updateData);

    // Xóa invoice items cũ
    await InvoiceItem.destroy({ where: { invoice_id: invoice.id } });

    // Tạo invoice items mới
    const invoiceItems = [];
    
    // Tiền phòng
    if (roomFee > 0) {
      invoiceItems.push({
        invoice_id: invoice.id,
        description: 'Tiền thuê phòng',
        amount: roomFee
      });
    }

    // Tiền điện
    if (electricityCost > 0) {
      invoiceItems.push({
        invoice_id: invoice.id,
        description: `Điện: ${electricityOld} → ${electricityNew} kWh (${electricityRate.toLocaleString()} VND/kWh)`,
        amount: electricityCost
      });
    }

    // Tiền nước
    if (waterCost > 0) {
      invoiceItems.push({
        invoice_id: invoice.id,
        description: `Nước: ${waterOld} → ${waterNew} m³ (${waterRate.toLocaleString()} VND/m³)`,
        amount: waterCost
      });
    }

    // Tạo các invoice items mới
    if (invoiceItems.length > 0) {
      await InvoiceItem.bulkCreate(invoiceItems);
    }

    // Lấy hóa đơn đã cập nhật với invoice_items
    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: Contract, include: [{ model: Room, include: [Property] }, { model: User, as: 'tenant' }] },
        { model: InvoiceItem, as: 'invoice_items' }
      ]
    });

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(400).json({ message: 'Cập nhật hóa đơn thất bại' });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  const invoice = await Invoice.findByPk(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
  await invoice.destroy();
  res.json({ success: true });
});

router.post('/invoice-items', async (req, res) => {
  const created = await InvoiceItem.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Tạo mục hóa đơn thất bại' });
  res.status(201).json(created);
});

router.post('/payments', async (req, res) => {
  const created = await Payment.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Ghi nhận thanh toán thất bại' });
  // Autoset invoice to paid if sum payments >= total
  try {
    const invoice = await Invoice.findByPk(created.invoice_id, { include: [Payment] });
    const paid = invoice.payments.reduce((s, p) => s + Number(p.amount_paid || 0), 0);
    if (paid >= Number(invoice.total_amount)) {
      await invoice.update({ status: 'paid' });
    }
  } catch {}
  res.status(201).json(created);
});

// Utility meters
router.get('/utility-meters', async (_req, res) => {
  const meters = await UtilityMeter.findAll({
    include: [{ model: Room }]
  });
  res.json(meters);
});

router.post('/utility-meters', async (req, res) => {
  const created = await UtilityMeter.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Tạo công tơ thất bại' });
  res.status(201).json(created);
});

router.get('/utility-readings', async (_req, res) => {
  const readings = await UtilityReading.findAll({
    include: [{ model: UtilityMeter, include: [{ model: Room }] }],
    order: [['reading_timestamp', 'DESC']]
  });
  res.json(readings);
});

// Lấy chỉ số cuối cùng của một phòng
router.get('/utility-readings/latest/:roomId', async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const meters = await UtilityMeter.findAll({
      where: { room_id: roomId },
      include: [{
        model: UtilityReading,
        order: [['reading_timestamp', 'DESC']],
        limit: 1
      }]
    });
    
    const latestReadings = {};
    for (const meter of meters) {
      if (meter.UtilityReadings && meter.UtilityReadings.length > 0) {
        latestReadings[meter.meter_type] = meter.UtilityReadings[0].reading_value;
      }
    }
    
    res.json(latestReadings);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi lấy chỉ số' });
  }
});

router.post('/utility-readings', async (req, res) => {
  const created = await UtilityReading.create(req.body).catch(() => null);
  if (!created) return res.status(400).json({ message: 'Ghi chỉ số thất bại' });
  res.status(201).json(created);
});

// Reports management
router.get('/reports', async (_req, res) => {
  const list = await Report.findAll();
  res.json(list);
});

router.put('/reports/:id', async (req, res) => {
  const r = await Report.findByPk(req.params.id);
  if (!r) return res.status(404).json({ message: 'Không tìm thấy' });
  await r.update(req.body);
  res.json(r);
});

export default router;


