import { auth } from '@/app/api/auth/[...nextauth]/route'
import type { NextRequest } from 'next/server'

// For Server Components
export async function getServerSession() {
  return await auth()
}

// For API Routes
export async function getServerSessionFromRequest(request: NextRequest) {
  return await auth()
}
