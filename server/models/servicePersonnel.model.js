// server/models/servicePersonnel.model.js
module.exports = (sequelize, DataTypes) => {
    const ServicePersonnel = sequelize.define("service_personnel", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      specialization: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return ServicePersonnel;
  };