'use client'

import { signIn } from 'next-auth/react'

export default function StravaConnectButton() {
  const handleConnect = () => {
    signIn('strava', { callbackUrl: '/profile' })
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
    >
      Mit Strava verbinden
    </button>
  )
}
