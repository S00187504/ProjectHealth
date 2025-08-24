// Role icon helper (copied from sidebar)
const roleIcon = (role?: string) => {
  switch (role) {
    case "admin":
      return <span title="Admin" className="ml-2 text-yellow-400">★</span>;
    case "doctor":
      return <span title="Doctor" className="ml-2 text-green-400">🩺</span>;
    case "patient":
      return <span title="Patient" className="ml-2 text-blue-400">👤</span>;
    default:
      return <span title="User" className="ml-2 text-gray-400">👥</span>;
  }
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Use same color logic as appointments table
const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.trim().split(" ").map((n) => n[0]).join("").toUpperCase();
};
const getAvatarColorByRole = (role?: string) => {
  switch (role) {
    case "doctor":
      return "bg-blue-800";
    case "admin":
      return "bg-red-800";
    case "patient":
    default:
      return "bg-green-800";
  }
};
// import { ModeToggle } from "@/components/mode"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { MdLogout } from "react-icons/md"

export default function DashboardHeader() {
  // Helper to get border color by role
  // Get logout function and user data from AuthContext
  const { logout, user } = useAuth();

  console.log('user', user);

  return (
    <header className="py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Practice Manager</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className={`h-9 w-9 ${getAvatarColorByRole(user?.role)}`}>
              <AvatarFallback className="text-black font-bold text-lg flex items-center justify-center h-9 w-9 rounded-full">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            {/* Display Admin or User based on user role */}
            <span>{user?.name ? user.name : user?.isAdmin ? 'Admin' : 'User'}</span>
            <span className="flex items-center gap-1">
              {roleIcon(user?.role)}
              <span className="text-xs font-medium text-gray-500 capitalize">{user?.role || "user"}</span>
            </span>
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
          {/* Removed ModeToggle */}
        </div>
      </div>
    </header>
  )
}