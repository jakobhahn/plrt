import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      startAt: 'asc',
    },
  })

  const upcomingEvents = events.filter((e: { startAt: Date }) => new Date(e.startAt) >= new Date())
  const pastEvents = events.filter((e: { startAt: Date }) => new Date(e.startAt) < new Date())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Termine</h1>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Anstehende Termine
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event: { id: string; title: string; startAt: Date; endAt: Date | null; location: string | null; description: string | null; category: string }) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm font-medium text-blue-600">
                        {format(new Date(event.startAt), 'EEEE, d. MMMM yyyy', {
                          locale: de,
                        })}
                      </div>
                      {event.endAt && (
                        <div className="text-sm text-gray-500">
                          bis{' '}
                          {format(new Date(event.endAt), 'd. MMMM yyyy', {
                            locale: de,
                          })}
                        </div>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-gray-600 mb-2">📍 {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-gray-700">{event.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Vergangene Termine
          </h2>
          <div className="space-y-4">
            {pastEvents.map((event: { id: string; title: string; startAt: Date; endAt: Date | null; location: string | null; description: string | null; category: string }) => (
              <div
                key={event.id}
                className="bg-gray-50 rounded-lg shadow p-6 opacity-75"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm font-medium text-gray-600">
                        {format(new Date(event.startAt), 'EEEE, d. MMMM yyyy', {
                          locale: de,
                        })}
                      </div>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-gray-600 mb-2">📍 {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-gray-700">{event.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Keine Termine vorhanden.</p>
        </div>
      )}
    </div>
  )
}
