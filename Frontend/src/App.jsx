import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './app/routes'

// Cara pública: layout + páginas
import LayoutPublico from './features/publico/LayoutPublico'
import {
  Inicio, Nosotros, Unidades, Noticias,
  Contacto, Postular, Acceso, NoEncontrado,
} from './features/publico/pages'

// Área privada: layout, guardia de permisos y páginas
import { SesionProvider } from './features/privado/context/SesionContext'
import LayoutPrivado from './features/privado/LayoutPrivado'
import RutaProtegida from './features/privado/components/RutaProtegida/RutaProtegida'
import {
  Dashboard, Personal, UnidadesOperativas,
  Turnos, Comunicados, Postulaciones,
} from './features/privado/pages'

// YA NO NECESITAMOS ESTO: import { PERMISOS } from './data/roles'

/**
 * ============================================================
 *  App · Mapa de rutas de la aplicación
 * ============================================================
 */
export default function App() {
  return (
    // ¡AQUÍ ESTÁ EL PROVIDER! Envuelve a todo para evitar la pantalla negra.
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

        {/* ---------- ÁREA PRIVADA (panel interno) ---------- */}
        
        {/* Dashboard Genérico (Accesible a cualquier rol autenticado) */}
        <Route
          path={ROUTES.PANEL}
          element={
            <LayoutPrivado>
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />
        
        {/* Personal: Solo para Capitán y Director */}
        <Route
          path={ROUTES.PANEL_PERSONAL}
          element={
            <LayoutPrivado>
              <RutaProtegida rolesPermitidos={['capitán', 'capitan', 'director']}>
                <Personal />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />
        
        {/* Unidades: Para Capitán, Director y Teniente */}
        <Route
          path={ROUTES.PANEL_UNIDADES}
          element={
            <LayoutPrivado>
              <RutaProtegida
                rolesPermitidos={['capitán', 'capitan', 'director', 'teniente']}
                mensaje="Tu rango no tiene acceso a la información de unidades."
              >
                <UnidadesOperativas />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />
        
        {/* Turnos: Solo para Capitán y Director */}
        <Route
          path={ROUTES.PANEL_TURNOS}
          element={
            <LayoutPrivado>
              <RutaProtegida
                rolesPermitidos={['capitán', 'capitan', 'director']}
                mensaje="Tu rango no tiene acceso a las planillas de turno."
              >
                <Turnos />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />
        
        {/* Comunicados: Para Capitán, Director y Teniente */}
        <Route
          path={ROUTES.PANEL_COMUNICADOS}
          element={
            <LayoutPrivado>
              <RutaProtegida
                rolesPermitidos={['capitán', 'capitan', 'director', 'teniente']}
                mensaje="Tu rango no gestiona comunicados."
              >
                <Comunicados />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />
        
        {/* Postulaciones: Exclusivo del Director */}
        <Route
          path={ROUTES.PANEL_POSTULACIONES}
          element={
            <LayoutPrivado>
              <RutaProtegida
                rolesPermitidos={['director']}
                mensaje="El seguimiento de postulaciones no está habilitado para tu rango."
              >
                <Postulaciones />
              </RutaProtegida>
            </LayoutPrivado>
          }
        />

        {/* Cualquier /panel/... desconocido vuelve al Dashboard. */}
        <Route path="/panel/*" element={<Navigate to={ROUTES.PANEL} replace />} />

        {/* 404: cualquier otra URL muestra la página "no encontrado". */}
        <Route path="*" element={<LayoutPublico><NoEncontrado /></LayoutPublico>} />
      </Routes>
    </SesionProvider>
  )
}