import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: [Role] });
    if (!user || !user.is_active) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    const token = jwt.sign(
      { id: user.id, role: user.role?.role_name || 'tenant', full_name: user.full_name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
  res.json({ token, user: { id: user.id, role: user.role?.role_name, full_name: user.full_name, email: user.email, phone_number: user.phone_number, is_active: user.is_active, must_change_password: !!user.must_change_password } });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin tạo tài khoản tenant
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

router.post('/admin/create-tenant', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { full_name, email, phone_number, password } = req.body;
    const tenantRole = await Role.findOne({ where: { role_name: 'tenant' } });
    if (!tenantRole) return res.status(400).json({ message: 'Missing tenant role seed' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      role_id: tenantRole.id,
      full_name,
      email,
      phone_number,
      password_hash,
      must_change_password: true,
    });
    res.status(201).json({ id: newUser.id });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tenant change password (and clear must_change_password)
router.post('/change-password', authenticateJWT, authorizeRoles('tenant', 'admin'), async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    if (req.user.role !== 'admin') {
      const valid = await bcrypt.compare(current_password || '', user.password_hash);
      if (!valid) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    const newHash = await bcrypt.hash(new_password, 10);
    await user.update({ password_hash: newHash, must_change_password: false });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Đổi mật khẩu thất bại' });
  }
});

export default router;


