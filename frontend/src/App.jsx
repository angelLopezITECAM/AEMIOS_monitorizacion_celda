
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from '@/app/layout'
import { DashboardTermopar } from '@/components/dashboard/dashboard-termopar'
import { DashboardBombas } from '@/components/dashboard/dashboard-bombas'
import { DashboardGemelo } from '@/components/dashboard/dashboard-gemelo'
import { ControlApp } from '@/components/control/control'

import { DashboardAnodo } from '@/components/dashboard/dashboard-anodo'
import { DashboardCatodo } from '@/components/dashboard/dashboard-catodo'
import { DashboardIntensidad } from '@/components/dashboard/dashboard-intensidad'
import { DashboardCelda } from '@/components/dashboard/dashboard-celda'
import { DashboardTemperatura } from '@/components/dashboard/dashboard-temperatura'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardBombas />} />
          <Route path="/dashboard/bombas" element={<DashboardBombas />} />
          <Route path="/dashboard/termopar" element={<DashboardTermopar />} />
          <Route path="/gemelo" element={<DashboardGemelo />} />
          <Route path="/panel-control" element={<ControlApp />} />
          {/* <Route path="/dashboard/anodo" element={<DashboardAnodo />} />
          <Route path="/dashboard/catodo" element={<DashboardCatodo />} />
          <Route path="/dashboard/intensidad" element={<DashboardIntensidad />} />
          <Route path="/dashboard/celda" element={<DashboardCelda />} />
          <Route path="/dashboard/temperatura" element={<DashboardTemperatura />} />
          <Route path="/dashboard/gemelo" element={<DashboardGemelo />} /> */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
