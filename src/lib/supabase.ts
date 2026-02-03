// Supabase Client Configuration for NeoBI India
// Provides database persistence for reports, user data, and analytics

import { createClient } from '@supabase/supabase-js';

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          company_name: string | null;
          industry: string | null;
          location: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          company_name?: string | null;
          industry?: string | null;
          location?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          company_name?: string | null;
          industry?: string | null;
          location?: string | null;
        };
      };
      business_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          industry: string;
          sub_industry: string | null;
          location: string;
          state: string;
          city_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
          mrr: number;
          team_size: number;
          stage: string;
          founded_year: number | null;
          gst_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          industry: string;
          sub_industry?: string | null;
          location: string;
          state: string;
          city_tier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
          mrr: number;
          team_size: number;
          stage: string;
          founded_year?: number | null;
          gst_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['business_profiles']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          title: string;
          type: 'simulation' | 'analysis' | 'forecast' | 'compliance';
          data: Record<string, unknown>;
          insights: string[];
          created_at: string;
          is_public: boolean;
          share_token: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id: string;
          title: string;
          type: 'simulation' | 'analysis' | 'forecast' | 'compliance';
          data: Record<string, unknown>;
          insights?: string[];
          created_at?: string;
          is_public?: boolean;
          share_token?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      simulations: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          query: string;
          result: Record<string, unknown>;
          agents_used: string[];
          execution_time_ms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id: string;
          query: string;
          result: Record<string, unknown>;
          agents_used?: string[];
          execution_time_ms?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['simulations']['Insert']>;
      };
      decision_history: {
        Row: {
          id: string;
          user_id: string;
          simulation_id: string;
          decision_path: string[];
          outcome: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          simulation_id: string;
          decision_path: string[];
          outcome?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['decision_history']['Insert']>;
      };
      analytics: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          event_data: Record<string, unknown>;
          page: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          event_data?: Record<string, unknown>;
          page?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['analytics']['Insert']>;
      };
    };
  };
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Create client only if configured, otherwise return a mock client
export const supabase = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helper functions for database operations
export const db = {
  // User operations
  users: {
    async getById(id: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    async getByEmail(email: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    async upsert(user: Database['public']['Tables']['users']['Insert']) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('users')
        .upsert(user, { onConflict: 'email' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Business profile operations
  profiles: {
    async getByUserId(userId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(profile: Database['public']['Tables']['business_profiles']['Insert']) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('business_profiles')
        .insert(profile)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: Database['public']['Tables']['business_profiles']['Update']) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('business_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Report operations
  reports: {
    async getByUserId(userId: string, limit = 10) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    async getById(id: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    async getByShareToken(token: string) {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();
      if (error) throw error;
      return data;
    },
    async create(report: Database['public']['Tables']['reports']['Insert']) {
      if (!supabase) return null;
      const shareToken = crypto.randomUUID();
      const { data, error } = await (supabase as any)
        .from('reports')
        .insert({ ...report, share_token: shareToken })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async makePublic(id: string, isPublic: boolean) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('reports')
        .update({ is_public: isPublic })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Simulation operations
  simulations: {
    async save(simulation: Database['public']['Tables']['simulations']['Insert']) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('simulations')
        .insert(simulation)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getRecent(userId: string, limit = 20) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
  },

  // Decision history operations
  decisions: {
    async save(decision: Database['public']['Tables']['decision_history']['Insert']) {
      if (!supabase) return null;
      const { data, error } = await (supabase as any)
        .from('decision_history')
        .insert(decision)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getBySimulation(simulationId: string) {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('decision_history')
        .select('*')
        .eq('simulation_id', simulationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  },

  // Analytics operations
  analytics: {
    async track(event: Database['public']['Tables']['analytics']['Insert']) {
      if (!supabase) return null;
      const { error } = await (supabase as any).from('analytics').insert(event);
      if (error) console.error('Analytics tracking error:', error);
      return !error;
    },
    async getEventCounts(userId: string, days = 30) {
      if (!supabase) return [];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await supabase
        .from('analytics')
        .select('event_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', fromDate.toISOString());
      if (error) throw error;
      return data || [];
    },
  },
};

// SQL for creating tables (for reference - run in Supabase dashboard)
export const SCHEMA_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  company_name TEXT,
  industry TEXT,
  location TEXT
);

-- Business profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  sub_industry TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  city_tier TEXT DEFAULT 'Tier 1' CHECK (city_tier IN ('Tier 1', 'Tier 2', 'Tier 3')),
  mrr NUMERIC NOT NULL DEFAULT 0,
  team_size INTEGER NOT NULL DEFAULT 1,
  stage TEXT NOT NULL,
  founded_year INTEGER,
  gst_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('simulation', 'analysis', 'forecast', 'compliance')),
  data JSONB NOT NULL DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE
);

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result JSONB NOT NULL DEFAULT '{}',
  agents_used TEXT[] DEFAULT '{}',
  execution_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decision history table
CREATE TABLE IF NOT EXISTS decision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE,
  decision_path TEXT[] NOT NULL DEFAULT '{}',
  outcome JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_share_token ON reports(share_token);
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY users_self_access ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY profiles_user_access ON business_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY reports_user_access ON reports FOR ALL USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY simulations_user_access ON simulations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY decisions_user_access ON decision_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY analytics_user_access ON analytics FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
`;

export default supabase;
