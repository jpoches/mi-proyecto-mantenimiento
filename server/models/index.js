// server/models/index.js
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'building_maintenance',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.users = require('./user.model')(sequelize, Sequelize);
db.clients = require('./client.model')(sequelize, Sequelize);
db.servicePersonnel = require('./servicePersonnel.model')(sequelize, Sequelize);
db.requests = require('./request.model')(sequelize, Sequelize);
db.workOrders = require('./workOrder.model')(sequelize, Sequelize);
db.tasks = require('./task.model')(sequelize, Sequelize);
db.invoices = require('./invoice.model')(sequelize, Sequelize);
db.notifications = require('./notification.model')(sequelize, Sequelize);
db.calendarEvents = require('./calendarEvent.model')(sequelize, Sequelize);
db.attachments = require('./attachment.model')(sequelize, Sequelize);
db.quotes = require('./quote.model')(sequelize, Sequelize);

// Definir relaciones
db.requests.hasMany(db.quotes, { foreignKey: 'request_id' });
db.quotes.belongsTo(db.requests, { foreignKey: 'request_id' });

db.clients.hasMany(db.requests, { foreignKey: 'client_id' });
db.requests.belongsTo(db.clients, { foreignKey: 'client_id' });

db.users.hasOne(db.clients, { foreignKey: 'user_id' });
db.clients.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasOne(db.servicePersonnel, { foreignKey: 'user_id' });
db.servicePersonnel.belongsTo(db.users, { foreignKey: 'user_id' });

db.requests.hasMany(db.workOrders, { foreignKey: 'request_id' });
db.workOrders.belongsTo(db.requests, { foreignKey: 'request_id' });

db.servicePersonnel.hasMany(db.workOrders, { foreignKey: 'assigned_to' });
db.workOrders.belongsTo(db.servicePersonnel, { foreignKey: 'assigned_to' });

db.workOrders.hasMany(db.tasks, { foreignKey: 'work_order_id' });
db.tasks.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

db.workOrders.hasMany(db.invoices, { foreignKey: 'work_order_id' });
db.invoices.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

db.clients.hasMany(db.invoices, { foreignKey: 'client_id' });
db.invoices.belongsTo(db.clients, { foreignKey: 'client_id' });

db.users.hasMany(db.notifications, { foreignKey: 'user_id' });
db.notifications.belongsTo(db.users, { foreignKey: 'user_id' });

db.workOrders.hasMany(db.calendarEvents, { foreignKey: 'work_order_id' });
db.calendarEvents.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

db.requests.hasMany(db.attachments, { foreignKey: 'request_id' });
db.attachments.belongsTo(db.requests, { foreignKey: 'request_id' });

module.exports = db;