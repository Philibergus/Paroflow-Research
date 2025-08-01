import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './views/Dashboard'
import Patients from './views/Patients'
import Correspondants from './views/Correspondants'
import Reports from './views/Reports'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/correspondants" element={<Correspondants />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </>
  )
}

export default App