'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateCredits: (amount: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil do usuário do Supabase
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase não configurado. Usando modo demo.');
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) throw error;

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.email.split('@')[0],
          credits: profile.credits,
          plan: profile.plan as 'free' | 'pro',
          createdAt: new Date(profile.created_at),
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase não configurado. Configure as variáveis de ambiente.');
      setIsLoading(false);
      return;
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setIsLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
      await loadUserProfile(data.user);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado. Configure as variáveis de ambiente.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    
    if (data.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: name,
          credits: 100,
          plan: 'free',
        });

      if (profileError) throw profileError;
      await loadUserProfile(data.user);
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  const updateCredits = async (amount: number) => {
    if (!user) return;

    if (!isSupabaseConfigured()) {
      console.warn('Supabase não configurado. Créditos não serão persistidos.');
      setUser({ ...user, credits: user.credits + amount });
      return;
    }

    const newCredits = user.credits + amount;

    // Atualizar no banco de dados
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar créditos:', error);
      return;
    }

    // Registrar transação
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount,
        type: amount > 0 ? 'bonus' : 'usage',
        description: amount > 0 ? 'Créditos adicionados' : 'Créditos utilizados',
      });

    // Atualizar estado local
    setUser({ ...user, credits: newCredits });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateCredits, isLoading }}>
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
