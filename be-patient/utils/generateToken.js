/**
 * Token Generation Utility
 * 
 * Creates JSON Web Tokens (JWT) for authentication:
 * - Generates tokens with user ID as payload
 * - Sets appropriate expiration time
 * - Uses secret key from environment variables
 * - Configures token options for security
 * 
 * Used by authentication controller for login and registration.
 */
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken; 
