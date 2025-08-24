'use client';
import React from 'react';
// import { ModeToggle } from './mode';
import { MdLogout } from 'react-icons/md';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const { logout, user } = useAuth();
  console.log('user', user);
  // Helper to get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Practice Manager</div>
      {user ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-gray-700 text-white font-bold text-lg flex items-center justify-center h-9 w-9 rounded-full">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            {/* Display Admin or User based on user role */}
            <span>{user && user.name}</span>
          </div>
          {/* Logout button - calls the logout function from AuthContext */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <MdLogout className="w-4 h-4" />
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
