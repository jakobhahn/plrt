'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const downloadSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  fileUrl: z.string().url('Gültige URL erforderlich'),
  fileSize: z.number().int().positive().optional(),
})

type DownloadFormData = z.infer<typeof downloadSchema>

interface Download {
  id: string
  title: string
  fileUrl: string
  fileSize: number | null
}

export default function DownloadForm({ download }: { download?: Download }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
    defaultValues: download
      ? {
          title: download.title,
          fileUrl: download.fileUrl,
          fileSize: download.fileSize || undefined,
        }
      : {},
  })

  const onSubmit = async (data: DownloadFormData) => {
    setLoading(true)
    setError('')

    try {
      const url = download
        ? `/api/admin/downloads/${download.id}`
        : '/api/admin/downloads'
      const method = download ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fileSize: data.fileSize || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fehler beim Speichern')
      }

      router.push('/admin/downloads')
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
          Datei URL *
        </label>
        <input
          type="url"
          {...register('fileUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.fileUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.fileUrl.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          URL zur Datei (z.B. PDF auf einem Cloud-Speicher)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dateigröße (Bytes, optional)
        </label>
        <input
          type="number"
          {...register('fileSize', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Wird automatisch ermittelt, wenn nicht angegeben
        </p>
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
