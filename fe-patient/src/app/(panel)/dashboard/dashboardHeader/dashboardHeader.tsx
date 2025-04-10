import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  return (
    <header className="py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">CarePulse</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Dashboard" />
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
            <span>Public Dashboard</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

