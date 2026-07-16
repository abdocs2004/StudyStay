import db from '../config/db.js';

// Internal helper used by other controllers to create a notification row.
// Not exposed as a route — imported directly where needed.
export const createNotification = async (userId, title, body) => {
  try {
    await db.query(
      'INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)',
      [userId, title, body]
    );
  } catch (error) {
    // Notifications are a secondary concern — never let a notification
    // failure break the primary action (sending a message, favoriting, etc).
    console.error('Error creating notification:', error);
  }
};

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [userId]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب الإشعارات' });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return res.json({ unread_count: rows[0].unread_count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب عدد الإشعارات غير المقروءة' });
  }
};

// @desc    Mark a single notification as read
// @route   POST /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  const { id: userId } = req.user;
  const { id: notificationId } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'الإشعار غير موجود' });
    }

    return res.json({ message: 'تم تحديث حالة الإشعار' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث الإشعار' });
  }
};

// @desc    Mark all of the current user's notifications as read
// @route   POST /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const [result] = await db.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return res.json({ updated: result.affectedRows });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث الإشعارات' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  const { id: userId } = req.user;
  const { id: notificationId } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'الإشعار غير موجود' });
    }

    return res.json({ message: 'تم حذف الإشعار' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف الإشعار' });
  }
};
