import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { MdLogout } from "react-icons/md"

export default function DashboardHeader() {
  // Get logout function and user data from AuthContext
  const { logout, user } = useAuth();

  return (
    <header className="py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Practice Manager</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Dashboard" />
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
             {/* Display Admin or User based on user role */}
            <span>{user?.isAdmin ? 'Admin' : 'User'}</span>
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
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}