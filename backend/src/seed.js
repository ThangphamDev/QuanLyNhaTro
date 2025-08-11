import bcrypt from 'bcryptjs';
import { Role, User } from './models/index.js';

export async function seedBasic() {
  // Roles
  const roles = ['admin', 'tenant'];
  for (const role of roles) {
    await Role.findOrCreate({ where: { role_name: role }, defaults: { role_name: role } });
  }

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Admin';
  if (adminEmail && adminPassword) {
    const adminRole = await Role.findOne({ where: { role_name: 'admin' } });
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        role_id: adminRole.id,
        full_name: adminName,
        email: adminEmail,
        password_hash: await bcrypt.hash(adminPassword, 10),
        is_active: true,
      },
    });
    return { adminSeeded: created };
  }
  return { adminSeeded: false };
}


