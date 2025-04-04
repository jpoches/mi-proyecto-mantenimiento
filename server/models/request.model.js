// server/models/request.model.js
module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define("request", {
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      service_type: {
        type: DataTypes.ENUM('electrical', 'plumbing', 'carpentry', 'painting', 'cleaning', 'other'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return Request;
  };