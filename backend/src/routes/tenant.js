import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import { Contract, Room, Property, Invoice, InvoiceItem, Report, User } from '../models/index.js';
import { Op } from 'sequelize';

const router = Router();
router.use(authenticateJWT, authorizeRoles('tenant'));

// Profile: get current user
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'full_name', 'email', 'phone_number', 'avatar_url', 'is_active', 'createdAt']
    });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile: update name and phone
router.put('/profile', async (req, res) => {
  try {
    const { full_name, phone_number, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    await user.update({
      ...(full_name !== undefined ? { full_name } : {}),
      ...(phone_number !== undefined ? { phone_number } : {}),
      ...(avatar_url !== undefined ? { avatar_url } : {}),
    });
    res.json({ id: user.id, full_name: user.full_name, email: user.email, phone_number: user.phone_number, avatar_url: user.avatar_url, is_active: user.is_active, createdAt: user.createdAt });
  } catch (e) {
    res.status(400).json({ message: 'Cập nhật hồ sơ thất bại' });
  }
});

// Dashboard: phòng hiện tại, hóa đơn gần nhất, thông báo (đơn giản hóa)
router.get('/dashboard', async (req, res) => {
  const userId = req.user.id;
  try {
    const contract = await Contract.findOne({ where: { tenant_id: userId, status: 'active' }, include: [{ model: Room, include: [Property] }] });
    const latestInvoice = await Invoice.findOne({ where: contract ? { contract_id: contract.id } : {}, order: [['createdAt', 'DESC']] });
    res.json({ contract, latestInvoice });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/contracts', async (req, res) => {
  const userId = req.user.id;
  const contracts = await Contract.findAll({ where: { tenant_id: userId }, include: [{ model: Room, include: [Property] }] });
  res.json(contracts);
});

// Contract detail
router.get('/contracts/:id', async (req, res) => {
  const userId = req.user.id;
  const contract = await Contract.findOne({ where: { id: req.params.id, tenant_id: userId }, include: [{ model: Room, include: [Property] }] });
  if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
  res.json(contract);
});

// Tenant sign contract (only own contract)
router.post('/contracts/:id/sign', async (req, res) => {
  try {
    const userId = req.user.id;
    const contract = await Contract.findOne({ where: { id: req.params.id, tenant_id: userId } });
    if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    if (contract.status !== 'active') return res.status(400).json({ message: 'Hợp đồng không ở trạng thái hiệu lực' });
    if (contract.is_signed) return res.status(400).json({ message: 'Hợp đồng đã được ký' });
    await contract.update({ is_signed: true, signed_at: new Date() });
    res.json(contract);
  } catch (e) {
    res.status(400).json({ message: 'Ký hợp đồng thất bại' });
  }
});

router.get('/invoices', async (req, res) => {
  const userId = req.user.id;
  const contracts = await Contract.findAll({ where: { tenant_id: userId } });
  const contractIds = contracts.map((c) => c.id);
  const invoices = await Invoice.findAll({ where: { contract_id: { [Op.in]: contractIds } }, include: [InvoiceItem] });
  res.json(invoices);
});

// Reports
router.post('/reports', async (req, res) => {
  try {
    const userId = req.user.id;
    const { room_id, title, description, report_type } = req.body;
    const report = await Report.create({ tenant_id: userId, room_id, title, description, report_type });
    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ message: 'Tạo báo cáo thất bại' });
  }
});

router.get('/reports', async (req, res) => {
  const userId = req.user.id;
  const list = await Report.findAll({ where: { tenant_id: userId } });
  res.json(list);
});

export default router;


