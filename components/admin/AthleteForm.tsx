'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const athleteSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  slug: z.string().min(1, 'Slug ist erforderlich'),
  photoUrl: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  disciplines: z.array(z.string()).min(1, 'Mindestens eine Disziplin'),
  group: z.string().optional(),
  achievements: z.string().optional(),
  active: z.boolean(),
})

type AthleteFormData = z.infer<typeof athleteSchema>

interface Athlete {
  id: string
  name: string
  slug: string
  photoUrl: string | null
  bio: string | null
  disciplines: string[]
  group: string | null
  achievements: string | null
  active: boolean
}

export default function AthleteForm({ athlete }: { athlete?: Athlete }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: athlete
      ? {
          name: athlete.name,
          slug: athlete.slug,
          photoUrl: athlete.photoUrl || '',
          bio: athlete.bio || '',
          disciplines: athlete.disciplines,
          group: athlete.group || '',
          achievements: athlete.achievements || '',
          active: athlete.active ?? true,
        }
      : {
          disciplines: [],
          active: true,
        },
  })

  const selectedDisciplines = watch('disciplines') || []

  const toggleDiscipline = (discipline: string) => {
    const current = selectedDisciplines
    if (current.includes(discipline)) {
      setValue(
        'disciplines',
        current.filter((d) => d !== discipline)
      )
    } else {
      setValue('disciplines', [...current, discipline])
    }
  }

  const onSubmit = async (data: AthleteFormData) => {
    setLoading(true)
    setError('')

    try {
      const url = athlete
        ? `/api/admin/athleten/${athlete.id}`
        : '/api/admin/athleten'
      const method = athlete ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          photoUrl: data.photoUrl || null,
          bio: data.bio || null,
          group: data.group || null,
          achievements: data.achievements || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fehler beim Speichern')
      }

      router.push('/admin/athleten')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug * (URL-freundlich, z.B. max-mustermann)
        </label>
        <input
          {...register('slug')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto URL
        </label>
        <input
          type="url"
          {...register('photoUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Disziplinen *
        </label>
        <div className="flex flex-wrap gap-2">
          {['TRIATHLON', 'LAUF'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDiscipline(d)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedDisciplines.includes(d)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        {errors.disciplines && (
          <p className="mt-1 text-sm text-red-600">
            {errors.disciplines.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Leistungsgruppe
        </label>
        <input
          {...register('group')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Erfolge
        </label>
        <textarea
          {...register('achievements')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('active')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">Aktiv</label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Wird gespeichert...' : 'Speichern'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
