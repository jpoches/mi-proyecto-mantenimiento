// server/models/workOrder.model.js
module.exports = (sequelize, DataTypes) => {
  const WorkOrder = sequelize.define("workOrder", {
    request_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'requests',
        key: 'id'
      }
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      references: {
        model: 'servicePersonnel',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
      allowNull: false
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