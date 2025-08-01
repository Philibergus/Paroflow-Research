export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Paroflow Backend API</h1>
      <p className="text-gray-600 mb-6">
        Le backend de Paroflow est opérationnel avec les endpoints suivants :
      </p>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Patients API</h2>
          <ul className="space-y-1 text-sm">
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/patients</code> - Liste des patients</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/patients</code> - Créer un patient</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/patients/[id]</code> - Détails d'un patient</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">PUT /api/patients/[id]</code> - Mettre à jour un patient</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/patients/[id]</code> - Supprimer un patient</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Correspondants API</h2>
          <ul className="space-y-1 text-sm">
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/correspondants</code> - Liste des correspondants</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/correspondants</code> - Créer un correspondant</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/correspondants/[id]</code> - Détails d'un correspondant</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">PUT /api/correspondants/[id]</code> - Mettre à jour un correspondant</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/correspondants/[id]</code> - Supprimer un correspondant</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Traitements API</h2>
          <ul className="space-y-1 text-sm">
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/traitements</code> - Liste des traitements</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/traitements</code> - Créer un traitement</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/traitements/[id]</code> - Détails d'un traitement</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">PUT /api/traitements/[id]</code> - Mettre à jour un traitement</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/traitements/[id]</code> - Supprimer un traitement</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/traitements/[id]/etapes</code> - Étapes d'un traitement</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/traitements/[id]/etapes</code> - Créer une étape</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Base de données initialisée</h3>
        <p className="text-green-700">
          La base de données a été créée avec des données de test incluant 5 patients, 
          3 correspondants, 5 traitements et leurs étapes associées.
        </p>
      </div>
    </div>
  )
}