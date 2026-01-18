import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Calendar, Download, BarChart } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const adminLinks: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    description: string
  }> = [
    {
      name: 'Athleten verwalten',
      href: '/admin/athleten',
      icon: Users,
      description: 'Athleten erstellen, bearbeiten und löschen',
    },
    {
      name: 'Termine verwalten',
      href: '/admin/termine',
      icon: Calendar,
      description: 'Veranstaltungen und Termine verwalten',
    },
    {
      name: 'Downloads verwalten',
      href: '/admin/downloads',
      icon: Download,
      description: 'Dateien hochladen und verwalten',
    },
    {
      name: 'Statistiken',
      href: '/stats',
      icon: BarChart,
      description: 'Vereinsstatistiken ansehen',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin-Bereich</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.name}
              href={link.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <Icon className="h-8 w-8 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {link.name}
              </h2>
              <p className="text-gray-600 text-sm">{link.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
