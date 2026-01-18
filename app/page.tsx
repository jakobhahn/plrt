import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const athleteCount = await prisma.athlete.count({ where: { active: true } })
  const upcomingEvents = await prisma.event.findMany({
    where: {
      startAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      startAt: 'asc',
    },
    take: 3,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          PLRT
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-8">
          Triathlon & Laufverein
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Willkommen beim PLRT! Wir sind ein aktiver Verein für Triathlon und
          Laufen. Gemeinsam trainieren wir, nehmen an Wettkämpfen teil und
          fördern den Sport in unserer Region.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {athleteCount}
          </div>
          <div className="text-gray-600">Aktive Athleten</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {upcomingEvents.length}
          </div>
          <div className="text-gray-600">Anstehende Termine</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
          <div className="text-gray-600">Disziplinen</div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nächste Termine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event: { id: string; title: string; startAt: Date; endAt: Date | null; location: string | null; description: string | null; category: string }) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(event.startAt).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                {event.location && (
                  <p className="text-gray-600 mb-2">📍 {event.location}</p>
                )}
                <Link
                  href="/termine"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Alle Termine ansehen →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Werde Teil unseres Vereins</h2>
        <p className="mb-6 text-blue-100">
          Interessiert an Triathlon oder Laufen? Schau dir unsere Athleten an
          oder kontaktiere uns!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/athleten"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Athleten ansehen
          </Link>
          <Link
            href="/kontakt"
            className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </div>
    </div>
  )
}
