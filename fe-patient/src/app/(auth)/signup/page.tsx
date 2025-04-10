'use client';

import React, { useState } from "react";
import { LuSquarePen } from "react-icons/lu";
import { GoMail } from "react-icons/go";
import { MdOutlineLock, MdOutlinePhone } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(fullname, email, password, phone);
      // No need to navigate here, the signup function handles it
    } catch (err) {
      // Error is already set in the auth context
      console.error('Signup failed', err);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center">
      <div className="w-full md:w-1/2 px-6 min-h-screen flex flex-col items-center justify-center">
        <section className="text-start w-full max-w-[600px]">
          <h2 className="text-xl mb-2">Sign up</h2>
          <p className="text-gray-700 mb-4 dark:text-gray-300">Get started with Appointments.</p>

          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="fullname" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                Full Name:
              </label>
              <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                <div className="text-gray-700 dark:text-gray-300">
                  <LuSquarePen className="w-4 h-4" />
                </div>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter your name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                  Email Address:
                </label>
                <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                  <div className="text-gray-700 dark:text-gray-300">
                    <GoMail className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="password" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                  Password:
                </label>
                <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                  <div className="text-gray-700 dark:text-gray-300">
                    <MdOutlineLock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 text-gray-700 dark:text-gray-300 text-sm block">
                Phone Number:
              </label>
              <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                <div className="text-gray-700 dark:text-gray-300">
                  <MdOutlinePhone className="w-4 h-4" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            
            <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </section>
      </div>
      <div className="w-full md:w-1/2 overflow-hidden h-screen justify-center hidden lg:block">
        <Image
          height={400}
          width={400}
          className="w-full max-h-[400px] md:max-h-none object-cover"
          src="/doctor.jpeg"
          alt="Doctor"
        />
      </div>
    </div>
  );
};

export default Signup; 