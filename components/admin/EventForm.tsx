'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const eventSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().optional(),
  startAt: z.string().min(1, 'Startdatum ist erforderlich'),
  endAt: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(['TRAINING', 'WETTKAMPF', 'VEREINSMEETING']),
})

type EventFormData = z.infer<typeof eventSchema>

interface Event {
  id: string
  title: string
  description: string | null
  startAt: Date
  endAt: Date | null
  location: string | null
  category: 'TRAINING' | 'WETTKAMPF' | 'VEREINSMEETING'
}

export default function EventForm({ event }: { event?: Event }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description || '',
          startAt: formatDate(event.startAt),
          endAt: event.endAt ? formatDate(event.endAt) : '',
          location: event.location || '',
          category: event.category,
        }
      : {
          category: 'TRAINING',
        },
  })

  const onSubmit = async (data: EventFormData) => {
    setLoading(true)
    setError('')

    try {
      const url = event
        ? `/api/admin/termine/${event.id}`
        : '/api/admin/termine'
      const method = event ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          description: data.description || null,
          endAt: data.endAt ? new Date(data.endAt).toISOString() : null,
          location: data.location || null,
          startAt: new Date(data.startAt).toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fehler beim Speichern')
      }

      router.push('/admin/termine')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-md p-8 space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titel *
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategorie *
        </label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="TRAINING">Training</option>
          <option value="WETTKAMPF">Wettkampf</option>
          <option value="VEREINSMEETING">Vereinsmeeting</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Startdatum & Zeit *
        </label>
        <input
          type="datetime-local"
          {...register('startAt')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.startAt && (
          <p className="mt-1 text-sm text-red-600">{errors.startAt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enddatum & Zeit (optional)
        </label>
        <input
          type="datetime-local"
          {...register('endAt')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ort
        </label>
        <input
          {...register('location')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beschreibung
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
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
