import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createUserTableIfNotExists } from '@/services/userTableService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create user table when user signs in
        if (event === 'SIGNED_IN' && session?.user?.email) {
          try {
            await createUserTableIfNotExists(session.user.email);
            console.log('User table check/creation completed for:', session.user.email);
          } catch (error) {
            console.error('Failed to create user table:', error);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Create user table for existing session
      if (session?.user?.email) {
        try {
          await createUserTableIfNotExists(session.user.email);
          console.log('User table check/creation completed for existing session:', session.user.email);
        } catch (error) {
          console.error('Failed to create user table for existing session:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response:', { data, error });
    
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting to sign up with email:', email);
    
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
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('Attempting to sign out');
    
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setSession(null);
      setUser(null);
    }
    
    console.log('Sign out response:', { error });
    
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
