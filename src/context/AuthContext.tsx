
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: '1',
    email: 'manufacturer@medico.com',
    password: 'password123',
    name: 'John Manufacturer',
    role: 'manufacturer',
    organization: 'Medico Pharmaceuticals'
  },
  {
    id: '2',
    email: 'distributor@lifeline.com',
    password: 'password123',
    name: 'Sarah Distributor',
    role: 'distributor',
    organization: 'Lifeline Distributors'
  },
  {
    id: '3',
    email: 'dispenser@citypharmacy.com',
    password: 'password123',
    name: 'Mike Dispenser',
    role: 'dispenser',
    organization: 'City Pharmacy'
  },
  {
    id: '4',
    email: 'regulator@authority.gov',
    password: 'password123',
    name: 'Lisa Regulator',
    role: 'regulator',
    organization: 'Regulatory Authority'
  },
  {
    id: '5',
    email: 'brandmanager@zenblock.com',
    password: 'password123',
    name: 'Emma Brand Manager',
    role: 'brand_manager',
    organization: 'Zenblock Labs',
    organizationId: '550e8400-e29b-41d4-a716-446655440000'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      const user: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        organization: mockUser.organization
      };
      
      setUser(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
