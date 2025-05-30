
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createUserTableIfNotExists } from '@/services/userTableService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null);
        
        // Clear timeout since we got a response
        clearTimeout(loadingTimeout);
        setLoading(false);

        // Create user table when user signs in
        if (event === 'SIGNED_IN' && session?.user?.email) {
          console.log('User signed in, creating table for:', session.user.email);
          try {
            const tableCreated = await createUserTableIfNotExists(session.user.email);
            console.log('User table creation result:', tableCreated);
          } catch (error) {
            console.error('Failed to create user table:', error);
            setAuthError('Failed to initialize user data');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setAuthError(error.message);
      }
      
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Clear timeout since we got a response
      clearTimeout(loadingTimeout);
      setLoading(false);

      // Create user table for existing session
      if (session?.user?.email) {
        console.log('Existing session found, creating table for:', session.user.email);
        try {
          const tableCreated = await createUserTableIfNotExists(session.user.email);
          console.log('User table creation result for existing session:', tableCreated);
        } catch (error) {
          console.error('Failed to create user table for existing session:', error);
          setAuthError('Failed to initialize user data');
        }
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    setAuthError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response:', { data, error });
    
    if (error) {
      setAuthError(error.message);
    }
    
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting to sign up with email:', email);
    setAuthError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    console.log('Sign up response:', { data, error });
    
    if (error) {
      setAuthError(error.message);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('Attempting to sign out');
    setAuthError(null);
    
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setSession(null);
      setUser(null);
    } else {
      setAuthError(error.message);
    }
    
    console.log('Sign out response:', { error });
    
    return { error };
  };

  return {
    user,
    session,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
  };
};
