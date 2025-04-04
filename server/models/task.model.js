// server/models/task.model.js
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("task", {
      work_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      estimated_time: {
        type: DataTypes.INTEGER // en minutos
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
      },
      start_time: {
        type: DataTypes.DATE
      },
      end_time: {
        type: DataTypes.DATE
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return Task;
  };