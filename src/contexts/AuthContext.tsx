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
        console.error('No profile found for user. Please contact admin.');
        throw new Error('Profile not found. Please sign up again or contact administrator.');
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Sign out user if profile doesn't exist
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
      });

      console.log('Auth signup result:', { authData, signUpError });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User creation failed');

      // Generate a unique employee ID if one already exists
      let finalEmployeeId = employeeId;
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('employee_id')
        .eq('employee_id', employeeId);
      
      if (existingProfiles && existingProfiles.length > 0) {
        finalEmployeeId = `${employeeId}_${Date.now()}`;
        console.log('Employee ID conflict, using:', finalEmployeeId);
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        email,
        employee_id: finalEmployeeId,
        department,
        role,
      });

      console.log('Profile creation result:', { profileError });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
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
    await supabase.auth.signOut();
    setProfile(null);
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
