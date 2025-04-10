
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, Leaf, LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  
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
            <Link to="/partners" className="text-sm font-medium hover:text-green transition-colors">
              Partners
            </Link>
            <Link to="/services" className="text-sm font-medium hover:text-green transition-colors">
              Services
            </Link>
            <Link to="/articles" className="text-sm font-medium hover:text-green transition-colors">
              Articles
            </Link>
            <Link to="/affiliates" className="text-sm font-medium hover:text-green transition-colors">
              Affiliates
            </Link>
            <Link to="/connect" className="text-sm font-medium hover:text-green transition-colors">
              Connect
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green rounded-full"></span>
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
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
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
