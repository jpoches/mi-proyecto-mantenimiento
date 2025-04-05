// server/models/invoice.model.js
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define("invoice", {
    work_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workOrders',
        key: 'id'
      }
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid'),
      defaultValue: 'pending',
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Invoice;
};