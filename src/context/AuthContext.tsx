
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '../components/ui/use-toast';

export interface User {
  id: string;
  username: string;
  isFirstLogin: boolean;
  profileCompleted: boolean;
  name?: string;
  profilePicture?: string;
  gender?: string;
  languages?: string[];
  bio?: string;
  experience?: string;
  therapyStyles?: string[];
  specializations?: string[];
  availability?: {
    days: string[];
    times: string[];
  };
  sessionPreferences?: {
    chat: boolean;
    audio: boolean;
    video: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  resetPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
  resetPassword: async () => {},
});

// Mock users for demo (in a real app, this would connect to a backend)
const mockUsers = [
  {
    id: '1',
    username: 'therapist1',
    password: 'welcome123', // In a real app, passwords would be hashed
    isFirstLogin: true,
    profileCompleted: false
  },
  {
    id: '2',
    username: 'therapist2',
    password: 'welcome123',
    isFirstLogin: false,
    profileCompleted: true,
    name: 'Sarah Johnson',
    profilePicture: '/placeholder.svg',
    gender: 'Female',
    languages: ['English', 'Spanish'],
    bio: 'Licensed therapist with 10 years of experience...',
    experience: '10 years',
    therapyStyles: ['CBT', 'Mindfulness'],
    specializations: ['Anxiety', 'Depression', 'Trauma'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      times: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM']
    },
    sessionPreferences: {
      chat: true,
      audio: true,
      video: true
    }
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('healernest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const foundUser = mockUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = foundUser;
        
        // Save to state and localStorage
        setUser(userWithoutPassword as User);
        localStorage.setItem('healernest_user', JSON.stringify(userWithoutPassword));
        
        toast({
          title: 'Login successful',
          description: foundUser.isFirstLogin 
            ? 'Welcome! Please reset your password to continue.'
            : 'Welcome back to HealerNest!',
          duration: 3000
        });
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
        duration: 3000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // In a real app, we would make an API call to update the password
      
      if (user) {
        // Update the user's first login status
        const updatedUser = {
          ...user,
          isFirstLogin: false
        };
        
        setUser(updatedUser);
        localStorage.setItem('healernest_user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Password updated',
          description: 'Your password has been updated successfully.',
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password. Please try again.',
        variant: 'destructive',
        duration: 3000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('healernest_user');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
      duration: 3000
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('healernest_user', JSON.stringify(updatedUser));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        duration: 3000
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout,
      updateUser,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
