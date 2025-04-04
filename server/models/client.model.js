// server/models/client.model.js
module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("client", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING
      },
      contact_person: {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return Client;
  };