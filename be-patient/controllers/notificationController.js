import Notification from '../models/Notification.js';

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    const {
      recipient,
      title,
      message,
      type,
      link,
      relatedTo,
      onModel,
      priority,
      expiresAt
    } = req.body;

    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      link,
      relatedTo,
      onModel,
      priority,
      expiresAt
    });

    if (notification) {
      res.status(201).json(notification);
    } else {
      res.status(400);
      throw new Error('Invalid notification data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .populate('recipient', 'fullname email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications/mynotifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get unread user notifications
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.user._id,
      isRead: false 
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      notification.isRead = true;
      const updatedNotification = await notification.save();
      res.json(updatedNotification);
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/readall
// @access  Private
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      // Only allow recipient or admin to delete
      if (notification.recipient.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized');
      }
      
      await notification.deleteOne();
      res.json({ message: 'Notification removed' });
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createNotification,
  getNotifications,
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
}; 