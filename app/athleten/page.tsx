export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface SearchParams {
  search?: string
  discipline?: string
  group?: string
  active?: string
}

export default async function AthletesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const where: any = {}

  if (searchParams.search) {
    where.name = {
      contains: searchParams.search,
      mode: 'insensitive',
    }
  }

  if (searchParams.discipline) {
    where.disciplines = {
      has: searchParams.discipline,
    }
  }

  if (searchParams.group) {
    where.group = searchParams.group
  }

  if (searchParams.active !== undefined) {
    where.active = searchParams.active === 'true'
  }

  const athletes = await prisma.athlete.findMany({
    where,
    orderBy: {
      name: 'asc',
    },
  })

  const disciplines = await prisma.athlete.findMany({
    select: { disciplines: true },
  })
  const uniqueDisciplines: string[] = Array.from(
    new Set(athletes.flatMap((a: { disciplines: string[] }) => a.disciplines))
  ) as string[]

  const groups = await prisma.athlete.findMany({
    where: { group: { not: null } },
    select: { group: true },
    distinct: ['group'],
  })
  const uniqueGroups = groups
    .map((g: { group: string | null }) => g.group)
    .filter((g: string | null): g is string => g !== null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Athleten</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form method="get" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suche
              </label>
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search}
                placeholder="Name suchen..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disziplin
              </label>
              <select
                name="discipline"
                defaultValue={searchParams.discipline || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                {uniqueDisciplines.map((d: string) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leistungsgruppe
              </label>
              <select
                name="group"
                defaultValue={searchParams.group || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                {uniqueGroups.map((g: string) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="active"
                defaultValue={searchParams.active || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                <option value="true">Aktiv</option>
                <option value="false">Passiv</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Filtern
            </button>
            <Link
              href="/athleten"
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Zurücksetzen
            </Link>
          </div>
        </form>
      </div>

      {/* Athletes Grid */}
      {athletes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Keine Athleten gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {athletes.map((athlete: { id: string; slug: string; name: string; photoUrl: string | null; disciplines: string[]; group: string | null; bio: string | null }) => (
            <Link
              key={athlete.id}
              href={`/athleten/${athlete.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {athlete.photoUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={athlete.photoUrl}
                    alt={athlete.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">
                    {athlete.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {athlete.name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {athlete.disciplines.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                {athlete.group && (
                  <p className="text-sm text-gray-600 mb-2">
                    Gruppe: {athlete.group}
                  </p>
                )}
                {athlete.bio && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {athlete.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
