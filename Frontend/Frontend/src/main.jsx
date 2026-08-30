import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TemaProvider } from './app/TemaContext'
import App from './App.jsx'
import './assets/styles/index.css'

/**
 * Punto de entrada de la aplicación.
 *
 * - createRoot: monta React en el <div id="root"> del index.html.
 * - TemaProvider: habilita el modo día/noche en toda la app.
 * - BrowserRouter: habilita el enrutado por URL.
 * - StrictMode: activa verificaciones extra de React en desarrollo.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TemaProvider>
  </StrictMode>,
)
