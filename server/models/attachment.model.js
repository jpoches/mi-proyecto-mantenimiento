// server/models/attachment.model.js
module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define("attachment", {
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id'
      }
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(100)
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Attachment;
};