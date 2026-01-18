import { prisma } from '@/lib/prisma'
import { Download } from 'lucide-react'

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unbekannt'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DownloadsPage() {
  const downloads = await prisma.download.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Downloads</h1>

      {downloads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Keine Downloads verfügbar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloads.map((download) => (
            <a
              key={download.id}
              href={download.fileUrl}
              download
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-start gap-4"
            >
              <div className="flex-shrink-0">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {download.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Größe: {formatFileSize(download.fileSize)}
                </p>
                <p className="text-sm text-gray-500">
                  Aktualisiert:{' '}
                  {new Date(download.updatedAt).toLocaleDateString('de-DE')}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
