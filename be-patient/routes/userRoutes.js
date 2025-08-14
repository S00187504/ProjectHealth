/**
 * User Routes
 *
 * Defines API endpoints for user operations:
 * - POST /api/users/login - User authentication
 * - POST /api/users - User registration
 * - GET /api/users/profile - Get user profile (protected)
 * - PUT /api/users/profile - Update user profile (protected)
 * - Additional admin routes for user management
 *
 * Applies appropriate middleware for route protection and
 * maps routes to controller functions.
 */
import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getAllDoctors,
  getAllPatients,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/').post(registerUser);
router.route('/profile').get(protect, getUserProfile);

// ✅ Public route to fetch doctors
router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);

export default router;
