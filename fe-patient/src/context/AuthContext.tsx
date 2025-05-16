'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';

// Define user type
type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullname: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application:
 * - Current user information and authentication status
 * - Login functionality with credential validation
 * - Logout functionality with state cleanup
 * - Registration for new users
 * - Loading and error states for authentication operations
 * 
 * Uses React Context API to make authentication available to all components.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          console.log("Found stored user info, verifying token...");
          const userData = JSON.parse(storedUser);
          
          // For the hardcoded admin user, we don't need to verify the token
          if (userData.email === "admin@example.com" && userData.isAdmin === true) {
            console.log("Admin user detected, using stored credentials");
            setUser(userData);
            
            // Refresh token and cookies
            Cookies.set('token', userData.token, { expires: 7, sameSite: 'Lax' });
            Cookies.set('user', storedUser, { expires: 7, sameSite: 'Lax' });
          } else {
            // For regular users, we could verify the token with the backend
            // For now, just use the stored data
            setUser(userData);
            
            // Refresh token and cookies
            Cookies.set('token', userData.token, { expires: 7, sameSite: 'Lax' });
            Cookies.set('user', storedUser, { expires: 7, sameSite: 'Lax' });
            
            console.log("User authenticated from stored credentials");
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          logout(); // Clear invalid data
        }
      } else {
        console.log("No stored authentication found");
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Function to refresh token (could be implemented for regular users)
  const refreshToken = async () => {
    // This would normally call an API endpoint to refresh the token
    // But for this implementation, we'll just ensure token consistency
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const token = userData.token;
        
        // Update localStorage and cookies to ensure consistency
        localStorage.setItem('token', token);
        Cookies.set('token', token, { expires: 7, sameSite: 'Lax' });
        
        console.log("Token refreshed in storage");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Hardcoded admin credentials
      const adminEmail = "admin@example.com";
      const adminPassword = "admin123";
      
      // Check if admin credentials are being used
      if (email === adminEmail && password === adminPassword) {
        console.log("Admin login detected");
        // Create admin user object
        const userData: User = {
          _id: "admin-id",
          name: "Admin",
          email: adminEmail,
          isAdmin: true,
          token: "admin-token"
        };
        
        // Save to state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        // Also save to cookies for middleware
        Cookies.set('token', userData.token, { expires: 7, sameSite: 'Lax' });
        Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'Lax' });
        
        console.log("Admin user data saved:", userData);
        
        // Redirect to dashboard
        router.push('/dashboard');
        return;
      }
      
      // Normal login flow for non-admin users
      const response = await authApi.login(email, password);
      const userData = response.data;
      
      // Save to state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      // Also save to cookies for middleware
      Cookies.set('token', userData.token, { expires: 7, sameSite: 'Lax' });
      Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'Lax' });
      
      // All users now go to the dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (fullname: string, email: string, password: string, phone: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register({ 
        name: fullname, 
        email, 
        password,
        phone
      });
      
      const userData = response.data;
      
      // Save to state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      // Also save to cookies for middleware
      Cookies.set('token', userData.token, { expires: 7, sameSite: 'Lax' });
      Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'Lax' });
      
      // Redirect to appropriate page based on role
      // New users are typically not admins, but we check just in case
      if (userData.isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/submitted');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Also remove cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 
