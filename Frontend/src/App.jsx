import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [mensajeServidor, setMensajeServidor] = useState('')

  useEffect(() => {
    // Hacemos la petición al puerto 8000, que es donde vive Django
    fetch('http://localhost:8000/api/prueba/')
      .then(respuesta => respuesta.json())
      .then(datos => setMensajeServidor(datos.mensaje))
      .catch(error => console.error("Error de conexión:", error))
  }, [])

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
        <h1>Plataforma Firehouse</h1>
        <p>Respuesta del Backend: <strong>{mensajeServidor || 'Cargando...'}</strong></p>
      </div>
    </>
  )
}

export default App
