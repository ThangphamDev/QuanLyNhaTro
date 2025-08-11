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
    res.json({ token, user: { id: user.id, role: user.role?.role_name, full_name: user.full_name, email: user.email } });
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
    });
    res.status(201).json({ id: newUser.id });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


