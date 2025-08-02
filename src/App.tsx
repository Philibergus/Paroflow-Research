import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/common'
import Dashboard from './views/Dashboard'
import { Toaster } from 'sonner'

// Utiliser le vrai Dashboard maintenant

const Patients = () => <div><h1 className="text-2xl font-bold">Patients</h1></div>
const Correspondants = () => <div><h1 className="text-2xl font-bold">Correspondants</h1></div>
const Reports = () => <div><h1 className="text-2xl font-bold">Rapports</h1></div>
const Todo = () => <div><h1 className="text-2xl font-bold">Tâches</h1></div>
const Statistics = () => <div><h1 className="text-2xl font-bold">Statistiques</h1></div>
const RendezVous = () => <div><h1 className="text-2xl font-bold">Rendez-vous</h1></div>
const DentalManagement = () => <div><h1 className="text-2xl font-bold">Gestion Dentaire</h1></div>

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dental" element={<DentalManagement />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/rendez-vous" element={<RendezVous />} />
          <Route path="/correspondants" element={<Correspondants />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </>
  )
}

export default App