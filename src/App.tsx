import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/common'
import Dashboard from './views/Dashboard'
import DentalManagement from './views/DentalManagement'
import Patients from './views/Patients'
import Correspondants from './views/Correspondants'
import ImplantManagement from './views/ImplantManagement'
import Reports from './views/Reports'
import Todo from './views/Todo'
import Statistics from './views/Statistics'
import RendezVous from './views/RendezVous'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dental" element={<DentalManagement />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/implants" element={<ImplantManagement />} />
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