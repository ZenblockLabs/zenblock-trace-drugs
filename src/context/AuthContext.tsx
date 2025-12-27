import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and role from database
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // Get user role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      // Get user profile if exists
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('user_id', userId)
        .single();

      let organizationName = 'Unknown Organization';
      if (profileData?.organization_id) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', profileData.organization_id)
          .single();
        if (orgData) {
          organizationName = orgData.name;
        }
      }

      const authUser: AuthUser = {
        id: userId,
        email: email,
        name: email.split('@')[0], // Use email prefix as name by default
        role: roleData?.role || 'user',
        organization: organizationName,
      };

      setUser(authUser);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set basic user info even if profile fetch fails
      setUser({
        id: userId,
        email: email,
        name: email.split('@')[0],
        role: 'user',
        organization: 'Unknown Organization',
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email || '');
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login exception:', error);
      return { error: error.message || 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return { error: error.message };
      }

      // Check if user already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'An account with this email already exists. Please log in instead.' };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      return { error: error.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session && !!user,
    login,
    signUp,
    logout,
    loading,
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
