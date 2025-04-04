// server/models/notification.model.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("notification", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      type: {
        type: DataTypes.ENUM('request', 'work_order', 'invoice', 'general'),
        defaultValue: 'general'
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    return Notification;
  };