// server/models/calendarEvent.model.js
module.exports = (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define("calendarEvent", {
    work_order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'workOrders',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CalendarEvent;
};