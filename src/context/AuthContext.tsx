
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

type Role = 'manufacturer' | 'distributor' | 'dispenser' | 'regulator';

interface UserData {
  id: string;
  name: string;
  role: Role;
  organization: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for the MVP with more distinctive passwords
const DEMO_USERS = [
  {
    email: 'manufacturer@zenblock.com',
    password: 'createMeds123',
    userData: {
      id: 'user1',
      name: 'John Manufacturer',
      role: 'manufacturer' as Role,
      organization: 'ZenPharma Inc.'
    }
  },
  {
    email: 'distributor@zenblock.com',
    password: 'shipMeds456',
    userData: {
      id: 'user2',
      name: 'Jane Distributor',
      role: 'distributor' as Role,
      organization: 'MediDistribute LLC'
    }
  },
  {
    email: 'dispenser@zenblock.com',
    password: 'provideMeds789',
    userData: {
      id: 'user3',
      name: 'Sam Pharmacist',
      role: 'dispenser' as Role,
      organization: 'ZenMed Pharmacy'
    }
  },
  {
    email: 'regulator@zenblock.com',
    password: 'overseeAll321',
    userData: {
      id: 'user4',
      name: 'Alex Regulator',
      role: 'regulator' as Role,
      organization: 'FDA'
    }
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Check for stored login on mount
    const storedUser = localStorage.getItem('zenblock_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('zenblock_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For MVP, we're using a simple in-memory authentication
    const user = DEMO_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (user) {
      setUser(user.userData);
      localStorage.setItem('zenblock_user', JSON.stringify(user.userData));
      toast.success(`Welcome, ${user.userData.name}`);
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zenblock_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
