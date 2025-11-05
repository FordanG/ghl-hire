'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, Company } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  userType: 'jobseeker' | 'employer' | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const userType = profile ? 'jobseeker' : company ? 'employer' : null;

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      setProfile(null);
      setCompany(null);
      return;
    }

    // Check for profile (job seeker)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    // Check for company (employer)
    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    setProfile(profileData);
    setCompany(companyData);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
        setCompany(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCompany(null);
  };

  const value = {
    user,
    profile,
    company,
    userType,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
