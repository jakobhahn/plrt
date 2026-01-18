import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StravaConnectButton from '@/components/StravaConnectButton'

export default async function ProfilePage() {
  const session = await getServerSession()
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      athlete: {
        include: {
          yearStats: {
            orderBy: {
              year: 'desc',
            },
          },
        },
      },
      stravaAccount: true,
    },
  })

  const currentYear = new Date().getFullYear()
  const currentYearStats = user?.athlete?.yearStats.find(
    (s: { year: number }) => s.year === currentYear
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Mein Profil</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* User Info */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Benutzerinformationen
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user?.name || 'N/A'}
            </p>
            <p>
              <span className="font-medium">E-Mail:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Rolle:</span>{' '}
              {user?.role === 'ADMIN' ? 'Administrator' : 'Mitglied'}
            </p>
          </div>
        </section>

        {/* Athlete Profile */}
        {user?.athlete ? (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Athletenprofil
            </h2>
            <div className="space-y-2 mb-4">
              <p>
                <span className="font-medium">Name:</span> {user.athlete.name}
              </p>
              <p>
                <span className="font-medium">Disziplinen:</span>{' '}
                {user.athlete.disciplines.join(', ')}
              </p>
              {user.athlete.group && (
                <p>
                  <span className="font-medium">Leistungsgruppe:</span>{' '}
                  {user.athlete.group}
                </p>
              )}
            </div>
            <Link
              href={`/athleten/${user.athlete.slug}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Profil ansehen →
            </Link>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Du hast noch kein Athletenprofil. Bitte kontaktiere einen
                Administrator.
              </p>
            </div>
          </section>
        )}

        {/* Strava Connection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Strava Verbindung
          </h2>
          {user?.stravaAccount ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">
                ✓ Strava ist verbunden
              </p>
              <p className="text-sm text-green-700">
                Letzte Synchronisation:{' '}
                {user.stravaAccount.lastSyncAt
                  ? new Date(user.stravaAccount.lastSyncAt).toLocaleString(
                      'de-DE'
                    )
                  : 'Noch nicht synchronisiert'}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 mb-4">
                Verbinde dein Strava-Konto, um deine Aktivitäten automatisch zu
                synchronisieren.
              </p>
              <StravaConnectButton />
            </div>
          )}
        </section>

        {/* Year Stats */}
        {currentYearStats && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Meine Statistiken {currentYear}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {currentYearStats.runKm.toFixed(1)} km
                </div>
                <div className="text-gray-600">Laufen</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentYearStats.bikeKm.toFixed(1)} km
                </div>
                <div className="text-gray-600">Radfahren</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
