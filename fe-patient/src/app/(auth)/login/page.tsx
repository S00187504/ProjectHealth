'use client';

import React, { useState } from "react";
import { LuSquarePen } from "react-icons/lu";
import { GoMail } from "react-icons/go";
import { MdOutlineLock, MdOutlinePhone } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Login function will handle fetching user data, but we'll let the
      // appropriate context components handle redirection based on user role
    } catch (err) {
      // Error is already set in the auth context
      console.error('Login failed', err);
    }
  };

  const setAdminCredentials = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setIsAdmin(true);
  };

  return (
    <div className="w-full flex">
      <div className="w-1/2 hidden md:block overflow-hidden">
        <img className="w-full" src="doctor.jpeg" alt="" />
      </div>
      <div className="w-full md:w-1/2 px-6 md:px-28 py-10 rounded-lg flex flex-col justify-center">
        <header>
          <h1 className="text-2xl text-center md:text-left">LOGO</h1>
        </header>

        <section className="mt-30 md:mt-6 text-center md:text-left">
          <h2 className="text-xl">Login</h2>
          <p className="text-gray-700 dark:text-gray-300">Welcome back.</p>
        </section>

        <section className="mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                Email Address:
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-300">
                <div className="px-3 text-gray-700 dark:text-gray-300">
                  <GoMail className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  className="py-5 w-full border-0 focus:ring-0 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                Password:
              </label>
              <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-green-300">
                <div className="px-3 text-gray-700 dark:text-gray-300">
                  <MdOutlineLock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  className="py-5 w-full border-0 focus:ring-0 focus:outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              variant="default"
              type="submit"
              className="w-full mt-3 font-semibold cursor-pointer py-6 rounded-md transition-all"
              disabled={loading}
            >
              {loading ? 'Logging in...' : `Login${isAdmin ? ' as Admin' : ''}`}
            </Button>
            
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-center text-gray-700 dark:text-gray-300">
                Don't have an account?{' '}
                <Link href="/signup" className="text-green-600 hover:underline">
                  Sign up
                </Link>
              </p>
              
              <div className="text-center mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Admin Access</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Administrators use the same login form
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="text-xs"
                  onClick={setAdminCredentials}
                >
                  Use Admin Credentials
                </Button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage; 