import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'motelpro',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
  }
);

export const Role = sequelize.define('roles', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  role_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
});

export const User = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  phone_number: { type: DataTypes.STRING(15) },
  avatar_url: { type: DataTypes.STRING(255) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export const Property = sequelize.define('properties', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
});

export const Room = sequelize.define('rooms', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  property_id: { type: DataTypes.INTEGER, allowNull: false },
  room_number: { type: DataTypes.STRING(20), allowNull: false },
  area: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  rent_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  max_tenants: { type: DataTypes.INTEGER, defaultValue: 1 },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'), defaultValue: 'available' },
});

export const RoomImage = sequelize.define('room_images', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.STRING(500), allowNull: false },
  caption: { type: DataTypes.STRING(255) },
  is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export const AssetType = sequelize.define('asset_types', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
});

export const Asset = sequelize.define('assets', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  property_id: { type: DataTypes.INTEGER, allowNull: false },
  room_id: { type: DataTypes.INTEGER },
  asset_type_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(255), allowNull: false },
  serial_number: { type: DataTypes.STRING(100), unique: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  purchase_date: { type: DataTypes.DATEONLY },
  warranty_end_date: { type: DataTypes.DATEONLY },
  value: { type: DataTypes.DECIMAL(12, 2) },
  status: { type: DataTypes.ENUM('in_use', 'in_storage', 'under_repair', 'disposed'), defaultValue: 'in_use' },
  notes: { type: DataTypes.TEXT },
});

export const Contract = sequelize.define('contracts', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  tenant_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY },
  rent_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  deposit_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
  status: { type: DataTypes.ENUM('active', 'expired', 'terminated'), defaultValue: 'active' },
  contract_url: { type: DataTypes.STRING(255) },
  content: { type: DataTypes.TEXT },
  is_signed: { type: DataTypes.BOOLEAN, defaultValue: false },
  signed_at: { type: DataTypes.DATE },
});

export const UtilityMeter = sequelize.define('utility_meters', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  meter_type: { type: DataTypes.ENUM('electricity', 'water'), allowNull: false },
  unit: { type: DataTypes.STRING(10), allowNull: false },
  serial_number: { type: DataTypes.STRING(100), unique: true },
  installed_date: { type: DataTypes.DATEONLY },
});

export const UtilityReading = sequelize.define('utility_readings', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  meter_id: { type: DataTypes.INTEGER, allowNull: false },
  reading_value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  reading_timestamp: { type: DataTypes.DATE, allowNull: false },
});

export const Invoice = sequelize.define('invoices', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  contract_id: { type: DataTypes.INTEGER, allowNull: false },
  issue_date: { type: DataTypes.DATEONLY, allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), defaultValue: 'pending' },
  billing_month: { type: DataTypes.INTEGER, allowNull: false },
  billing_year: { type: DataTypes.INTEGER, allowNull: false },
});

export const InvoiceItem = sequelize.define('invoice_items', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  invoice_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING(255), allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
});

export const Payment = sequelize.define('payments', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  invoice_id: { type: DataTypes.INTEGER, allowNull: false },
  payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  amount_paid: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  payment_method: { type: DataTypes.STRING(50) },
  transaction_code: { type: DataTypes.STRING(100) },
});

export const Report = sequelize.define('reports', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenant_id: { type: DataTypes.INTEGER, allowNull: false },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  report_type: { type: DataTypes.ENUM('maintenance', 'complaint', 'request'), allowNull: false },
  status: { type: DataTypes.ENUM('new', 'in_progress', 'resolved', 'closed'), defaultValue: 'new' },
});

export const Notification = sequelize.define('notifications', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  related_url: { type: DataTypes.STRING(255) },
});

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

Property.hasMany(Room, { foreignKey: 'property_id', onDelete: 'CASCADE' });
Room.belongsTo(Property, { foreignKey: 'property_id' });

Room.hasMany(RoomImage, { foreignKey: 'room_id', onDelete: 'CASCADE' });
RoomImage.belongsTo(Room, { foreignKey: 'room_id' });

Property.hasMany(Asset, { foreignKey: 'property_id', onDelete: 'CASCADE' });
Asset.belongsTo(Property, { foreignKey: 'property_id' });
Room.hasMany(Asset, { foreignKey: 'room_id' });
Asset.belongsTo(Room, { foreignKey: 'room_id' });
AssetType.hasMany(Asset, { foreignKey: 'asset_type_id' });
Asset.belongsTo(AssetType, { foreignKey: 'asset_type_id' });

Room.hasMany(Contract, { foreignKey: 'room_id' });
Contract.belongsTo(Room, { foreignKey: 'room_id' });
// Alias tenant relation explicitly to match includes using { as: 'tenant' }
Contract.belongsTo(User, { foreignKey: 'tenant_id', as: 'tenant' });
User.hasMany(Contract, { foreignKey: 'tenant_id', as: 'tenant_contracts' });
Contract.belongsTo(User, { foreignKey: 'tenant_id' });

Room.hasMany(UtilityMeter, { foreignKey: 'room_id' });
UtilityMeter.belongsTo(Room, { foreignKey: 'room_id' });
UtilityMeter.hasMany(UtilityReading, { foreignKey: 'meter_id' });
UtilityReading.belongsTo(UtilityMeter, { foreignKey: 'meter_id' });

Contract.hasMany(Invoice, { foreignKey: 'contract_id' });
Invoice.belongsTo(Contract, { foreignKey: 'contract_id' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id' });
Invoice.hasMany(Payment, { foreignKey: 'invoice_id' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Room.hasMany(Report, { foreignKey: 'room_id' });
Report.belongsTo(Room, { foreignKey: 'room_id' });
User.hasMany(Report, { foreignKey: 'tenant_id' });
Report.belongsTo(User, { foreignKey: 'tenant_id' });

export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database sync error:', error.message);
    // Fallback: try without alter
    try {
      await sequelize.sync({ force: false });
      console.log('Database synchronized without alter');
    } catch (fallbackError) {
      console.error('Database sync fallback error:', fallbackError.message);
    }
  }
}


