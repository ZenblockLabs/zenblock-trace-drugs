
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get organization ID from email
export const getOrganizationFromEmail = (email: string): string => {
  const emailLower = email.toLowerCase();
  if (emailLower.includes('manufacturer')) {
    return 'medico-pharmaceuticals';
  } else if (emailLower.includes('distributor')) {
    return 'lifeline-distributors';
  } else if (emailLower.includes('dispenser')) {
    return 'city-pharmacy';
  } else if (emailLower.includes('regulator')) {
    return 'regulatory-authority';
  }
  return 'medico-pharmaceuticals'; // default
};

// Helper function to check if user is regulator
export const isRegulatorUser = (email?: string): boolean => {
  return email?.toLowerCase().includes('regulator') || false;
};
