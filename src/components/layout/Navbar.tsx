
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, Leaf, LogOut, UserCircle, Calendar, MessageSquare, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { useToast } from "@/hooks/use-toast";

// Temporary notifications for this session.
const tempNotifications = [
  {
    id: 1,
    title: "Session Reminder",
    description: "You have a session with Jane Smith today at 3:00 PM.",
    type: "reminder",
    date: "April 21, 2025",
  },
  {
    id: 2,
    title: "New Message",
    description: "Michael Johnson sent you a new message.",
    type: "message",
    date: "April 20, 2025",
  },
];
const hasNotifications = tempNotifications.length > 0;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Show toast at login if there are multiple notifications
  React.useEffect(() => {
    if (
      hasNotifications &&
      tempNotifications.length > 1 &&
      location.pathname === "/" // On home page (simulate login)
    ) {
      toast({
        title: "Notifications",
        description: "You may have new messages, check notifications.",
      });
    }
  }, [location.pathname, toast]);

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="bg-green rounded-full p-1.5 mr-2">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">HealerNest</span>
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-green transition-colors">
              Home
            </Link>
            <Link to="/client-requests" className="text-sm font-medium hover:text-green transition-colors">
              Client Requests
            </Link>
            <Link to="/sessions" className="text-sm font-medium hover:text-green transition-colors">
              Sessions
            </Link>
            <Link to="/schedule" className="text-sm font-medium hover:text-green transition-colors">
              Schedule
            </Link>
            <Link to="/notifications" className="text-sm font-medium hover:text-green transition-colors">
              Notifications
            </Link>
            <Link to="/profile" className="text-sm font-medium hover:text-green transition-colors">
              Profile
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green rounded-full border-2 border-white"></span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-green text-primary-foreground">
                    {user?.name ? user.name[0] : 'T'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/client-requests">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Client Requests</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/sessions">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Sessions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Schedule</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
