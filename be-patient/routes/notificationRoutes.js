import express from 'express';
import {
  createNotification,
  getNotifications,
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createNotification)
  .get(protect, getNotifications);

router.route('/mynotifications')
  .get(protect, getMyNotifications);

router.route('/unread')
  .get(protect, getUnreadNotifications);

router.route('/readall')
  .put(protect, markAllNotificationsAsRead);

router.route('/:id/read')
  .put(protect, markNotificationAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

export default router; 