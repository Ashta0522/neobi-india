// NextAuth.js Configuration for NeoBI India
// Provides authentication with Google, GitHub, and Email/Password

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db, isSupabaseConfigured } from './supabase';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      subscriptionTier?: 'free' | 'pro' | 'enterprise';
      companyName?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
    companyName?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
    companyName?: string | null;
  }
}

// Check if OAuth providers are configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const isGitHubConfigured = process.env.GITHUB_ID && process.env.GITHUB_SECRET;

// Build providers array based on available configuration
const providers: NextAuthOptions['providers'] = [];

if (isGoogleConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

if (isGitHubConfigured) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  );
}

// Always include credentials provider for demo/development
providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Demo Login',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'demo@neobi.in' },
      password: { label: 'Password', type: 'password', placeholder: '••••••••' },
    },
    async authorize(credentials) {
      // Demo credentials for testing
      const demoUsers = [
        {
          id: 'demo-user-1',
          email: 'demo@neobi.in',
          password: 'demo123',
          name: 'Demo User',
          subscriptionTier: 'pro' as const,
          companyName: 'Demo Startup Pvt Ltd',
        },
        {
          id: 'demo-admin-1',
          email: 'admin@neobi.in',
          password: 'admin123',
          name: 'Admin User',
          subscriptionTier: 'enterprise' as const,
          companyName: 'NeoBI India',
        },
      ];

      const user = demoUsers.find(
        (u) => u.email === credentials?.email && u.password === credentials?.password
      );

      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscriptionTier,
          companyName: user.companyName,
        };
      }

      // If Supabase is configured, check database
      if (isSupabaseConfigured() && credentials?.email) {
        try {
          const dbUser = await db.users.getByEmail(credentials.email);
          if (dbUser && typeof dbUser === 'object' && 'id' in dbUser) {
            // In production, you would verify password hash here
            return {
              id: (dbUser as any).id,
              email: (dbUser as any).email,
              name: (dbUser as any).name,
              subscriptionTier: (dbUser as any).subscription_tier,
              companyName: (dbUser as any).company_name,
            };
          }
        } catch (error) {
          console.error('Database lookup failed:', error);
        }
      }

      return null;
    },
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/onboarding',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      // Save user to Supabase on sign in
      if (isSupabaseConfigured() && user.email) {
        try {
          await db.users.upsert({
            id: user.id,
            email: user.email,
            name: user.name || null,
            avatar_url: user.image || null,
          });

          // Track sign in event
          await db.analytics.track({
            user_id: user.id,
            event_type: 'sign_in',
            event_data: {
              provider: account?.provider || 'credentials',
            },
          });
        } catch (error) {
          console.error('Error saving user to Supabase:', error);
          // Don't block sign in if Supabase fails
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier;
        token.companyName = user.companyName;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.subscriptionTier = session.subscriptionTier;
        token.companyName = session.companyName;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.subscriptionTier = token.subscriptionTier;
        session.user.companyName = token.companyName;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Track sign out event
      if (isSupabaseConfigured() && token?.id) {
        await db.analytics.track({
          user_id: token.id,
          event_type: 'sign_out',
        });
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Helper hook for client-side auth status
export function getAuthStatus() {
  return {
    isGoogleEnabled: isGoogleConfigured,
    isGitHubEnabled: isGitHubConfigured,
    isCredentialsEnabled: true,
    isDatabaseEnabled: isSupabaseConfigured(),
  };
}

// Export for use in API routes
export default authOptions;
