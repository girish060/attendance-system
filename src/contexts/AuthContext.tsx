import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, employeeId: string, department: string, role?: 'admin' | 'user') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile data:', data);
      console.log('Profile error:', error);

      if (error) {
        console.error('Profile query error:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No profile found for user, creating default profile...');
        // Create a basic profile if none exists
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user?.email || 'unknown@example.com',
            full_name: user?.user_metadata?.full_name || 'User',
            employee_id: user?.user_metadata?.employee_id || `EMP_${userId.substring(0, 8)}`,
            department: user?.user_metadata?.department || 'Engineering',
            role: user?.user_metadata?.role || 'user'
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Sign out if we can't create profile
          await supabase.auth.signOut();
          setProfile(null);
          setLoading(false);
          return;
        }
        
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Sign out user on error
      await supabase.auth.signOut();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    employeeId: string,
    department: string,
    role: 'admin' | 'user' = 'user'
  ) => {
    try {
      console.log('Starting signup process...');
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            employee_id: employeeId,
            department,
            role,
          },
        },
      });

      console.log('Auth signup result:', { authData, signUpError });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User creation failed');

      // Create profile manually (trigger might not be set up yet)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        email,
        employee_id: employeeId,
        department,
        role,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // If it's a duplicate, that's okay (trigger already created it)
        if (!profileError.message.includes('duplicate') && !profileError.message.includes('unique')) {
          throw profileError;
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      // Force clear any cached session
      localStorage.clear();
      sessionStorage.clear();
      // Reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear even on error
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
