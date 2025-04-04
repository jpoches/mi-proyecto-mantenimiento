// server/models/workOrder.model.js
module.exports = (sequelize, DataTypes) => {
    const WorkOrder = sequelize.define("work_order", {
      request_id: {
        type: DataTypes.INTEGER
      },
      assigned_to: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
      },
      scheduled_date: {
        type: DataTypes.DATE
      },
      completed_date: {
        type: DataTypes.DATE
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return WorkOrder;
  };