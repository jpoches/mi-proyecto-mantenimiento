// server/models/attachment.model.js
module.exports = (sequelize, DataTypes) => {
    const Attachment = sequelize.define("attachment", {
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_type: {
        type: DataTypes.STRING
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    return Attachment;
  };