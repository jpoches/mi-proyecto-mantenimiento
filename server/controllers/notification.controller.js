// server/controllers/notification.controller.js
const db = require("../models");
const Notification = db.notifications;
const User = db.users;
const { Op } = require("sequelize");

// Obtener todas las notificaciones
exports.findAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [["created_at", "DESC"]]
    });
    res.send(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las notificaciones."
    });
  }
};

// Encontrar notificaciones por usuario
exports.findByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit: 20
    });
    res.send(notifications);
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    res.status(500).send({
      message: error.message || `Error al recuperar las notificaciones para el usuario ${userId}.`
    });
  }
};

// Encontrar notificaciones no leídas
exports.findUnread = async (req, res) => {
  try {
    // Si el ID de usuario está en la solicitud, filtrar por ese usuario
    const userId = req.query.userId;
    const whereClause = { is_read: false };
    
    if (userId) {
      whereClause.user_id = userId;
    }
    
    const notifications = await Notification.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]]
    });
    res.send(notifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).send({
      message: error.message || "Error al recuperar las notificaciones no leídas."
    });
  }
};

// Marcar notificación como leída
exports.markAsRead = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Notification.update(
      { is_read: true },
      { where: { id: id } }
    );

    if (num === 1) {
      res.send({
        message: "Notificación marcada como leída exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo marcar la notificación con id=${id} como leída. Tal vez la notificación no existe.`
      });
    }
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    res.status(500).send({
      message: error.message || `Error al marcar la notificación con id=${id} como leída.`
    });
  }
};

// Marcar todas las notificaciones como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    // Si el ID de usuario está en la solicitud, filtrar por ese usuario
    const userId = req.body.userId;
    const whereClause = { is_read: false };
    
    if (userId) {
      whereClause.user_id = userId;
    }
    
    const [num] = await Notification.update(
      { is_read: true },
      { where: whereClause }
    );

    res.send({
      message: `${num} notificaciones marcadas como leídas exitosamente.`
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).send({
      message: error.message || "Error al marcar todas las notificaciones como leídas."
    });
  }
};

// Eliminar una notificación
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Notification.destroy({
      where: { id: id }
    });

    if (num === 1) {
      res.send({
        message: "Notificación eliminada exitosamente."
      });
    } else {
      res.status(404).send({
        message: `No se pudo eliminar la notificación con id=${id}. Tal vez la notificación no existe.`
      });
    }
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    res.status(500).send({
      message: error.message || `Error al eliminar la notificación con id=${id}.`
    });
  }
};