import { useState, useEffect } from 'react'
// Eliminamos la importación de ESTADOS_OPERATIVOS si estaba en un archivo separado,
// o puedes actualizar el archivo contenidoPublico.js con este nuevo diccionario.
import { useSesion } from '../../context/SesionContext' 
import { IconoUbicacion } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './UnidadesOperativas.css'

// 1. Definimos las claves exactas que espera tu base de datos (Django)
const OPCIONES = ['disponible', 'emergencia', 'servicio', 'taller']

// 2. Mapeamos cada clave de la BD a su etiqueta visual y color
const ESTADOS_OPERATIVOS = {
  disponible: { etiqueta: 'Disponible', color: 'var(--c-exito, #10b981)' },
  emergencia: { etiqueta: 'En Emergencia', color: 'var(--c-alerta, #f59e0b)' },
  servicio:   { etiqueta: 'Acto de Servicio', color: 'var(--c-info, #3b82f6)' },
  taller:     { etiqueta: 'Fuera de Servicio', color: 'var(--c-peligro, #ef4444)' }
}

export default function UnidadesOperativas() {
  const { rango, tipo } = useSesion()
  const API_URL = import.meta.env.VITE_API_URL; 

  const [unidades, setUnidades] = useState([])

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  const rolesAutorizados = ['capitán', 'capitan', 'director', 'teniente']
  const tienePermiso = rolesAutorizados.includes(rangoActual) || rolesAutorizados.includes(tipoActual)

  const puedeCambiar = tienePermiso
  const puedeMover = tienePermiso

  useEffect(() => {
    const cargarMaterialMayor = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/Operacion/MaterialMayor/listar/`);
        if (respuesta.ok) {
          const data = await respuesta.json();
          setUnidades(data);
        }
      } catch (error) {
        console.error("Error al cargar Material Mayor:", error);
      }
    };
    cargarMaterialMayor();
  }, [API_URL]);

  const cambiarEstado = async (id_material, nuevoEstado) => {
    // nuevoEstado ahora será exactamente 'disponible', 'emergencia', 'servicio' o 'taller'
    setUnidades((prev) =>
      prev.map((u) => (u.id_material === id_material ? { ...u, estado: nuevoEstado } : u))
    )

    try {
      const respuesta = await fetch(`${API_URL}/api/Operacion/MaterialMayor/${id_material}/editar/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: nuevoEstado // Se envía el valor simplificado a Django
        })
      });

      if (!respuesta.ok) {
        console.error("El backend rechazó la actualización del estado.");
      }
    } catch (error) {
      console.error("Error de conexión con el backend:", error);
    }
  }

  return (
    <>
      <div className="vista-head">
        <h1>Material Mayor</h1>
        <p>Pizarra operativa: estado y ubicación de las unidades en tiempo real.</p>
      </div>
      <div className="unidades-panel-grid">
        {unidades.map((u) => {
          // Normalizamos el estado que viene de la BD a minúsculas para que coincida con el diccionario
          const estadoKey = u.estado ? u.estado.toLowerCase() : 'taller'
          const est = ESTADOS_OPERATIVOS[estadoKey] ?? ESTADOS_OPERATIVOS.taller
          
          return (
            <div className="unidad-panel-card" key={u.id_material}>
              <div className="unidad-panel-card__head">
                <span className="unidad-panel-card__id">{u.id_material}</span>
                <span className="unidad-panel-card__estado" style={{ '--c': est.color }}><i /> {est.etiqueta}</span>
              </div>
              
              <h3>{u.nombre}</h3>
              <span className="unidad-panel-card__tipo">{u.especialidad || 'Sin especialidad'}</span>
              
              <div className="mapa-mock">
                <div className="mapa-mock__grid" />
                <span className="mapa-mock__pin" style={{ color: est.color }}>
                  <IconoUbicacion width={26} />
                </span>
                <span className="mapa-mock__label">
                  {puedeMover ? 'Cuartel · sector norte' : 'Ubicación registrada'}
                </span>
              </div>
              
              {puedeCambiar ? (
                <div className="unidad-panel-card__acciones">
                  <label>Cambiar estado</label>
                  <select 
                    value={estadoKey} 
                    onChange={(e) => cambiarEstado(u.id_material, e.target.value)}
                  >
                    {/* El value del option es la clave de la BD (ej: 'emergencia'), 
                        pero el texto visible es la etiqueta formal (ej: 'En Emergencia') */}
                    {OPCIONES.map((o) => (
                      <option key={o} value={o}>{ESTADOS_OPERATIVOS[o].etiqueta}</option>
                    ))}
                  </select>
                  {puedeMover && (
                    <button className="btn-mini" style={{ marginTop: 8, width: '100%' }}>
                      <IconoUbicacion width={14} /> Mover ubicación
                    </button>
                  )}
                </div>
              ) : (
                <p className="unidad-panel-card__solo-lectura">
                  Puedes ver la ubicación y el estado. Solo tenientes, capitán y directora pueden modificarlos.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}