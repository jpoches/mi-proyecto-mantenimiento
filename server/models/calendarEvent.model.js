// server/models/calendarEvent.model.js
module.exports = (sequelize, DataTypes) => {
    const CalendarEvent = sequelize.define("calendar_event", {
      work_order_id: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
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