import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import StravaProvider from './strava-provider'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[Auth] Missing credentials')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            console.error(`[Auth] User not found: ${credentials.email}`)
            return null
          }

          // Since we don't have a password field in the User model,
          // we'll use a simple demo approach: check if user exists
          // For production, you should add a password field to the User model
          // and store hashed passwords using bcrypt
          
          // For now, allow login for any existing user (demo mode)
          // TODO: Add password field to User model and implement proper password verification
          console.log(`[Auth] Login successful for user: ${user.email}`)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('[Auth] Error in authorize:', error)
          return null
        }
      },
    }),
    ...(process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET
      ? [
          StravaProvider({
            clientId: process.env.STRAVA_CLIENT_ID,
            clientSecret: process.env.STRAVA_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.sub!
        session.user.role = token.role as 'ADMIN' | 'MEMBER'
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role
      }
      if (account?.provider === 'strava' && account.access_token && user) {
        // Store Strava tokens in database
        const { encrypt } = await import('./encryption')
        try {
          await prisma.stravaAccount.upsert({
            where: { userId: user.id },
            update: {
              athleteStravaId: account.providerAccountId,
              accessTokenEnc: encrypt(account.access_token),
              refreshTokenEnc: encrypt(account.refresh_token || ''),
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : new Date(Date.now() + 6 * 60 * 60 * 1000), // Default 6 hours
            },
            create: {
              userId: user.id,
              athleteStravaId: account.providerAccountId,
              accessTokenEnc: encrypt(account.access_token),
              refreshTokenEnc: encrypt(account.refresh_token || ''),
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : new Date(Date.now() + 6 * 60 * 60 * 1000),
            },
          })
        } catch (error) {
          console.error('Error storing Strava tokens:', error)
        }
      }
      return token
    },
  } as any,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Required for Vercel deployments
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'ADMIN' | 'MEMBER'
    }
  }

  interface User {
    role: 'ADMIN' | 'MEMBER'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'MEMBER'
    stravaAccessToken?: string
    stravaRefreshToken?: string
  }
}
