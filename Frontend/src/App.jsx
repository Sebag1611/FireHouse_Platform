import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './app/routes'

import LayoutPublico from './features/publico/LayoutPublico'
import { Inicio, Nosotros, Unidades, Noticias, Contacto, Postular, Acceso, NoEncontrado } from './features/publico/pages'

import { SesionProvider } from './features/privado/context/SesionContext'
import LayoutPrivado from './features/privado/LayoutPrivado'
import RutaProtegida from './features/privado/components/RutaProtegida/RutaProtegida'
// ¡Aquí agregamos Cursos a la lista de importaciones!
import { Dashboard, Personal, UnidadesOperativas, Turnos, Comunicados, Postulaciones, Cursos } from './features/privado/pages'

export default function App() {
  return (
    <SesionProvider>
      <Routes>
        {/* ---------- CARA PÚBLICA ---------- */}
        <Route path={ROUTES.HOME} element={<LayoutPublico><Inicio /></LayoutPublico>} />
        <Route path={ROUTES.NOSOTROS} element={<LayoutPublico><Nosotros /></LayoutPublico>} />
        <Route path={ROUTES.UNIDADES} element={<LayoutPublico><Unidades /></LayoutPublico>} />
        <Route path={ROUTES.NOTICIAS} element={<LayoutPublico><Noticias /></LayoutPublico>} />
        <Route path={ROUTES.CONTACTO} element={<LayoutPublico><Contacto /></LayoutPublico>} />
        <Route path={ROUTES.POSTULAR} element={<LayoutPublico><Postular /></LayoutPublico>} />
        <Route path={ROUTES.ACCESO} element={<LayoutPublico><Acceso /></LayoutPublico>} />

        {/* ---------- ÁREA PRIVADA ---------- */}
        <Route path={ROUTES.PANEL} element={<LayoutPrivado><RutaProtegida><Dashboard /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_PERSONAL} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director']}><Personal /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_UNIDADES} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director', 'teniente', 'bombero']}><UnidadesOperativas /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_TURNOS} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director', 'teniente', 'bombero']}><Turnos /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_CURSOS} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director', 'teniente', 'bombero']}><Cursos /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_COMUNICADOS} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director', 'teniente', 'bombero']}><Comunicados /></RutaProtegida></LayoutPrivado>} />
        
        <Route path={ROUTES.PANEL_POSTULACIONES} element={<LayoutPrivado><RutaProtegida rolesPermitidos={['director']}><Postulaciones /></RutaProtegida></LayoutPrivado>} />
        
        <Route path="/panel/*" element={<Navigate to={ROUTES.PANEL} replace />} />
        <Route path="*" element={<LayoutPublico><NoEncontrado /></LayoutPublico>} />
      </Routes>
    </SesionProvider>
  )
}