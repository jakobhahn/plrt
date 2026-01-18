import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const { handlers, auth } = NextAuth(authOptions as any)

export const { GET, POST } = handlers
export { auth }
