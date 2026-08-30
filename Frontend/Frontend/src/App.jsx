import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './app/routes'

// Cara pública: layout + páginas (desde el barrel)
import LayoutPublico from './features/publico/LayoutPublico'
import {
  Inicio, Nosotros, Unidades, Noticias,
  Contacto, Postular, Acceso, NoEncontrado,
} from './features/publico/pages'

// Área privada: layout, guardia de permisos y páginas
import LayoutPrivado from './features/privado/LayoutPrivado'
import RutaProtegida from './features/privado/components/RutaProtegida'
import {
  Dashboard, Personal, UnidadesOperativas,
  Turnos, Cursos, Comunicados, Postulaciones,
} from './features/privado/pages'
import { PERMISOS } from './data/roles'

/**
 * ============================================================
 *  App · Mapa de rutas de la aplicación
 * ============================================================
 *  Único lugar donde se declara qué componente responde a cada
 *  URL. Se apoya en:
 *   - ROUTES: las URLs centralizadas (sin strings sueltos).
 *   - LayoutPublico / LayoutPrivado: envuelven cada zona con su
 *     estructura (navbar+footer vs. sidebar del panel).
 *   - RutaProtegida: restringe las vistas internas por permiso.
 *
 *  Se separa la CARA PÚBLICA del ÁREA PRIVADA para que el mapa
 *  del sitio se lea de un vistazo.
 * ============================================================
 */
export default function App() {
  return (
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
      {/* El Dashboard es accesible a cualquier rol autenticado. */}
      <Route
        path={ROUTES.PANEL}
        element={<LayoutPrivado><Dashboard /></LayoutPrivado>}
      />
      <Route
        path={ROUTES.PANEL_PERSONAL}
        element={
          <LayoutPrivado>
            <RutaProtegida permiso={PERMISOS.VER_BOMBEROS}>
              <Personal />
            </RutaProtegida>
          </LayoutPrivado>
        }
      />
      <Route
        path={ROUTES.PANEL_UNIDADES}
        element={
          <LayoutPrivado>
            <RutaProtegida
              permiso={PERMISOS.VER_UNIDADES}
              mensaje="Tu rango no tiene acceso a la información de unidades."
            >
              <UnidadesOperativas />
            </RutaProtegida>
          </LayoutPrivado>
        }
      />
      <Route
        path={ROUTES.PANEL_TURNOS}
        element={
          <LayoutPrivado>
            <RutaProtegida
              permiso={PERMISOS.VER_TURNOS}
              mensaje="Tu rango no tiene acceso a las planillas de turno."
            >
              <Turnos />
            </RutaProtegida>
          </LayoutPrivado>
        }
      />
      <Route
        path={ROUTES.PANEL_CURSOS}
        element={
          <LayoutPrivado>
            <RutaProtegida
              permiso={PERMISOS.VER_CURSOS}
              mensaje="Tu rango no tiene acceso a los cursos."
            >
              <Cursos />
            </RutaProtegida>
          </LayoutPrivado>
        }
      />
      <Route
        path={ROUTES.PANEL_COMUNICADOS}
        element={
          <LayoutPrivado>
            <RutaProtegida
              permiso={PERMISOS.VER_COMUNICADOS}
              mensaje="Tu rango no gestiona comunicados."
            >
              <Comunicados />
            </RutaProtegida>
          </LayoutPrivado>
        }
      />
      <Route
        path={ROUTES.PANEL_POSTULACIONES}
        element={
          <LayoutPrivado>
            <RutaProtegida
              permiso={PERMISOS.VER_POSTULACIONES}
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
  )
}
