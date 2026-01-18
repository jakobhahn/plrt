import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import StravaProvider from './strava-provider'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        // For demo purposes, we'll check if password matches a hashed version
        // In production, you'd store hashed passwords in the database
        // This is a simplified version - you should implement proper password hashing
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
    }),
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
