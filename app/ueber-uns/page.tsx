export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Über uns</h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Unser Verein
          </h2>
          <p className="text-gray-700 mb-4">
            Der PLRT ist ein aktiver Triathlon- und Laufverein, der sich der
            Förderung des Ausdauersports verschrieben hat. Wir bieten
            Trainingsmöglichkeiten für alle Leistungsniveaus und organisieren
            regelmäßig gemeinsame Trainings, Wettkämpfe und Vereinsveranstaltungen.
          </p>
          <p className="text-gray-700">
            Unser Ziel ist es, eine Gemeinschaft zu schaffen, in der sich
            Athleten gegenseitig unterstützen, motivieren und gemeinsam ihre
            Ziele erreichen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Disziplinen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Triathlon
              </h3>
              <p className="text-gray-700">
                Schwimmen, Radfahren und Laufen – die Königsdisziplin des
                Ausdauersports. Wir trainieren alle drei Disziplinen und nehmen
                an Triathlon-Wettkämpfen teil.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Laufen
              </h3>
              <p className="text-gray-700">
                Von 5K bis Marathon – wir bieten Trainings für alle
                Laufdistanzen und Leistungsniveaus. Gemeinsam laufen macht mehr
                Spaß!
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Mitglied werden
          </h2>
          <p className="text-gray-700 mb-4">
            Interessiert? Lade dir unseren Mitgliedsantrag herunter oder
            kontaktiere uns direkt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/downloads"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Downloads
            </a>
            <a
              href="/kontakt"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              Kontakt
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
