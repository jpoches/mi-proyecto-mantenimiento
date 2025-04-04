// server/models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: console.log,  // Para ver los logs SQL y ayudar con la depuración
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.users = require("./user.model.js")(sequelize, Sequelize);
db.clients = require("./client.model.js")(sequelize, Sequelize);
db.servicePersonnel = require("./servicePersonnel.model.js")(sequelize, Sequelize);
db.requests = require("./request.model.js")(sequelize, Sequelize);
db.workOrders = require("./workOrder.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);
db.invoices = require("./invoice.model.js")(sequelize, Sequelize);
db.notifications = require("./notification.model.js")(sequelize, Sequelize);
db.calendarEvents = require("./calendarEvent.model.js")(sequelize, Sequelize);
db.attachments = require("./attachment.model.js")(sequelize, Sequelize);

// Definir relaciones
// User - Client
db.users.hasMany(db.clients, { foreignKey: 'user_id' });
db.clients.belongsTo(db.users, { foreignKey: 'user_id' });

// User - Service Personnel
db.users.hasMany(db.servicePersonnel, { foreignKey: 'user_id' });
db.servicePersonnel.belongsTo(db.users, { foreignKey: 'user_id' });

// Client - Request
db.clients.hasMany(db.requests, { foreignKey: 'client_id' });
db.requests.belongsTo(db.clients, { foreignKey: 'client_id' });

// Request - Work Order
db.requests.hasMany(db.workOrders, { foreignKey: 'request_id' });
db.workOrders.belongsTo(db.requests, { foreignKey: 'request_id' });

// Service Personnel - Work Order
db.servicePersonnel.hasMany(db.workOrders, { foreignKey: 'assigned_to' });
db.workOrders.belongsTo(db.servicePersonnel, { foreignKey: 'assigned_to' });

// Work Order - Task
db.workOrders.hasMany(db.tasks, { foreignKey: 'work_order_id' });
db.tasks.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

// Work Order - Invoice
db.workOrders.hasMany(db.invoices, { foreignKey: 'work_order_id' });
db.invoices.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

// Client - Invoice
db.clients.hasMany(db.invoices, { foreignKey: 'client_id' });
db.invoices.belongsTo(db.clients, { foreignKey: 'client_id' });

// User - Notification
db.users.hasMany(db.notifications, { foreignKey: 'user_id' });
db.notifications.belongsTo(db.users, { foreignKey: 'user_id' });

// Work Order - Calendar Event
db.workOrders.hasMany(db.calendarEvents, { foreignKey: 'work_order_id' });
db.calendarEvents.belongsTo(db.workOrders, { foreignKey: 'work_order_id' });

// Request - Attachment
db.requests.hasMany(db.attachments, { foreignKey: 'request_id' });
db.attachments.belongsTo(db.requests, { foreignKey: 'request_id' });

module.exports = db;