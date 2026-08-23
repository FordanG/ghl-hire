'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, Company } from '@/lib/supabase';
import { deferAuthStateWork } from './auth-state';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  adminRole: string | null;
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
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userType = profile ? 'jobseeker' : company ? 'employer' : null;

  const refreshProfile = async (authenticatedUser?: User) => {
    const currentUser = authenticatedUser ?? (await supabase.auth.getUser()).data.user;

    if (!currentUser) {
      setProfile(null);
      setCompany(null);
      setAdminRole(null);
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

    const { data: adminRoleData } = profileData
      ? await supabase
          .from('admin_roles')
          .select('role')
          .eq('profile_id', profileData.id)
          .maybeSingle()
      : { data: null };

    setProfile(profileData);
    setCompany(companyData);
    setAdminRole(adminRoleData?.role || null);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await refreshProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        deferAuthStateWork(
          async () => {
            await refreshProfile(session.user);
            setLoading(false);
          },
          {
            onError: (error) => {
              console.error('Failed to refresh account after auth change:', error);
              setProfile(null);
              setCompany(null);
              setAdminRole(null);
              setLoading(false);
            },
          }
        );
      } else {
        setProfile(null);
        setCompany(null);
        setAdminRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCompany(null);
    setAdminRole(null);
  };

  const value: AuthContextType = {
    user,
    profile,
    company,
    adminRole,
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
