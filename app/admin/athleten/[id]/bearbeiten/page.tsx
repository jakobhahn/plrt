import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AthleteForm from '@/components/admin/AthleteForm'

export default async function EditAthletePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const { id } = await params
  const athlete = await prisma.athlete.findUnique({
    where: { id },
  })

  if (!athlete) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Athlet bearbeiten
      </h1>
      <AthleteForm athlete={athlete} />
    </div>
  )
}
