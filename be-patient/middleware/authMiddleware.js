/**
 * Authentication Middleware
 * 
 * Provides route protection and access control:
 * - Verifies JWT tokens from request headers
 * - Attaches authenticated user to request object
 * - Implements role-based access control (admin vs regular users)
 * - Handles authentication errors with appropriate responses
 * 
 * Used by protected routes to ensure only authenticated and
 * authorized users can access specific endpoints.
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Admin middleware - ensures the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

export { protect, admin }; 
