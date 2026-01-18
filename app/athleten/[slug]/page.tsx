import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AthleteDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerSession(authOptions)

  const athlete = await prisma.athlete.findUnique({
    where: { slug: params.slug },
    include: {
      user: {
        include: {
          stravaAccount: true,
        },
      },
      yearStats: {
        orderBy: {
          year: 'desc',
        },
      },
    },
  })

  if (!athlete) {
    notFound()
  }

  const currentYear = new Date().getFullYear()
  const currentYearStats = athlete.yearStats.find(
    (s) => s.year === currentYear
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {athlete.photoUrl ? (
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={athlete.photoUrl}
                  alt={athlete.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold">
                  {athlete.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{athlete.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                {athlete.disciplines.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </div>
              {athlete.group && (
                <p className="text-blue-100">Leistungsgruppe: {athlete.group}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Bio */}
          {athlete.bio && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Über mich
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{athlete.bio}</p>
            </section>
          )}

          {/* Achievements */}
          {athlete.achievements && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Erfolge
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {athlete.achievements}
              </p>
            </section>
          )}

          {/* Strava Connection */}
          {session && athlete.user && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Strava
              </h2>
              {athlete.user.stravaAccount ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ Strava verbunden
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Strava noch nicht verbunden
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Year Stats */}
          {session && currentYearStats && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Jahresstatistiken {currentYear}
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

          {/* Historical Stats */}
          {session && athlete.yearStats.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Historische Statistiken
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jahr
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Laufen (km)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Radfahren (km)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {athlete.yearStats.map((stat) => (
                      <tr key={stat.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stat.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stat.runKm.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {stat.bikeKm.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
