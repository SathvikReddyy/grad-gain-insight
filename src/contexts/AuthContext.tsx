
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // If we're in the middle of signing out, ignore any auth state changes
        if (isSigningOut) {
          console.log('Ignoring auth state change during signout');
          return;
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT event received');
          setSession(null);
          setUser(null);
          setLoading(false);
          // Navigate to home page
          window.location.replace('/');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isSigningOut]);

  const signOut = async () => {
    console.log('SignOut function called');
    setIsSigningOut(true);
    
    try {
      // Clear state immediately
      setSession(null);
      setUser(null);
      setLoading(false);
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Call Supabase signOut (but don't wait for it)
      supabase.auth.signOut().catch(error => {
        console.error('Error signing out:', error);
      });
      
      // Force immediate redirect
      console.log('Forcing immediate redirect');
      window.location.replace('/');
      
    } catch (error) {
      console.error('Error in signOut:', error);
      // Force redirect even on error
      window.location.replace('/');
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
