import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function StatsPage() {
  const session = await getServerSession()
  if (!session) {
    redirect('/login')
  }

  const currentYear = new Date().getFullYear()

  // Get all year stats for current year
  const yearStats = await prisma.stravaYearStats.findMany({
    where: {
      year: currentYear,
    },
    include: {
      athlete: true,
    },
  })

  // Calculate totals
  const totalRunKm = yearStats.reduce((sum: number, stat: { runKm: number }) => sum + stat.runKm, 0)
  const totalBikeKm = yearStats.reduce((sum: number, stat: { bikeKm: number }) => sum + stat.bikeKm, 0)

  // Leaderboard
  const runLeaderboard = [...yearStats]
    .sort((a: { runKm: number }, b: { runKm: number }) => b.runKm - a.runKm)
    .slice(0, 10)
  const bikeLeaderboard = [...yearStats]
    .sort((a: { bikeKm: number }, b: { bikeKm: number }) => b.bikeKm - a.bikeKm)
    .slice(0, 10)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Vereinsstatistiken {currentYear}
      </h1>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {totalRunKm.toFixed(1)} km
          </div>
          <div className="text-gray-700 text-lg">Gesamt Laufen</div>
        </div>
        <div className="bg-green-50 rounded-lg p-8 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {totalBikeKm.toFixed(1)} km
          </div>
          <div className="text-gray-700 text-lg">Gesamt Radfahren</div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Run Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Top 10 Laufen
          </h2>
          {runLeaderboard.length === 0 ? (
            <p className="text-gray-500">Noch keine Daten verfügbar.</p>
          ) : (
            <div className="space-y-3">
              {runLeaderboard.map((stat: { id: string; runKm: number; athlete: { name: string } }, index: number) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">
                      {stat.athlete.name}
                    </span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {stat.runKm.toFixed(1)} km
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bike Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Top 10 Radfahren
          </h2>
          {bikeLeaderboard.length === 0 ? (
            <p className="text-gray-500">Noch keine Daten verfügbar.</p>
          ) : (
            <div className="space-y-3">
              {bikeLeaderboard.map((stat: { id: string; bikeKm: number; athlete: { name: string } }, index: number) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">
                      {stat.athlete.name}
                    </span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {stat.bikeKm.toFixed(1)} km
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
