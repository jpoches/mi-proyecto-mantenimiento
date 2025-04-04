// server/models/user.model.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.ENUM('admin', 'client', 'technician'),
        allowNull: false,
        defaultValue: 'client'
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return User;
  };