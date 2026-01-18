export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Kontakt</h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Kontaktinformationen
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">E-Mail</h3>
            <a
              href="mailto:info@plrt.de"
              className="text-blue-600 hover:text-blue-700"
            >
              info@plrt.de
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
            <p className="text-gray-700">
              PLRT Triathlon & Laufverein
              <br />
              Musterstraße 123
              <br />
              12345 Musterstadt
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Trainingszeiten
            </h3>
            <p className="text-gray-700">
              Dienstag: 18:00 Uhr (Laufen)
              <br />
              Donnerstag: 19:00 Uhr (Schwimmen)
              <br />
              Samstag: 09:00 Uhr (Radfahren)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Nachricht senden
        </h2>
        <p className="text-gray-700 mb-4">
          Für Fragen, Anregungen oder Informationen nutze bitte unsere
          E-Mail-Adresse oder kontaktiere uns über die sozialen Medien.
        </p>
        <a
          href="mailto:info@plrt.de"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          E-Mail senden
        </a>
      </div>
    </div>
  )
}
