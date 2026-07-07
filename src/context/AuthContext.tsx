import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { hospitals } from '@/data/mockData';

type User = {
  id: string;
  name: string;
  username: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Extract the 15 distinct hospitals logically
const MOCK_HOSPITALS = hospitals.map(h => ({
  id: h.id,
  name: h.name,
  username: h.name.toLowerCase().split(' ').slice(0, 2).join('').replace(/[^a-z]/g, ''),
  password: 'pass123',
}));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, password: string) => {
    const validHospital = MOCK_HOSPITALS.find(
      (h) => h.username === username && h.password === password
    );

    if (validHospital) {
      setIsAuthenticated(true);
      const userPayload = { id: validHospital.id, name: validHospital.name, username: validHospital.username };
      setUser(userPayload);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userPayload));
      toast.success('Successfully logged in');
      return true;
    }
    
    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
