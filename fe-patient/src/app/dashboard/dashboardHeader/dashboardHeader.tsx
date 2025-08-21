import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { MdLogout } from "react-icons/md"

export default function DashboardHeader() {
  // Role icons
  const roleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <span title="Admin" className="text-yellow-400 text-xl">★</span>;
      case 'doctor':
        return <span title="Doctor" className="text-green-400 text-xl">🩺</span>;
      case 'patient':
        return <span title="Patient" className="text-blue-400 text-xl">👤</span>;
      default:
        return <span title="User" className="text-gray-400 text-xl">👥</span>;
    }
  };
  // Get logout function and user data from AuthContext
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
    <header className="py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Practice Manager</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{roleIcon(user?.role)}</span>
            <span className="ml-2 font-semibold">{user?.name}</span>
            <span className="ml-2 text-xs text-gray-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</span>
          </div>
           {/* Logout button - calls the logout function from AuthContext */}
          {/* <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <MdLogout className="w-4 h-4" />
            Logout
          </Button> */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}