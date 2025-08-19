import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@booksnap.com',
    name: 'System Administrator',
    role: 'super_admin',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-01-01',
    streak: 45,
    totalScans: 1250,
    friends: [],
    preferences: {
      theme: 'system',
      notifications: true,
      autoSync: true,
      language: 'en',
      privacy: {
        shareScans: false,
        allowFriendRequests: true,
        showActivity: true
      }
    }
  },
  {
    id: '2',
    email: 'teacher@booksnap.com',
    name: 'Sarah Johnson',
    role: 'educator',
    avatar: 'https://images.pexels.com/photos/3767411/pexels-photo-3767411.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-02-15',
    streak: 23,
    totalScans: 450,
    friends: ['3', '4'],
    preferences: {
      theme: 'light',
      notifications: true,
      autoSync: true,
      language: 'en',
      privacy: {
        shareScans: true,
        allowFriendRequests: true,
        showActivity: true
      }
    }
  },
  {
    id: '3',
    email: 'student@booksnap.com',
    name: 'Alex Chen',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-03-01',
    streak: 12,
    totalScans: 89,
    friends: ['2'],
    preferences: {
      theme: 'dark',
      notifications: true,
      autoSync: true,
      language: 'en',
      privacy: {
        shareScans: true,
        allowFriendRequests: true,
        showActivity: true
      }
    }
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('booksnap_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('booksnap_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('booksnap_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};