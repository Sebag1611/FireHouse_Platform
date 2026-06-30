import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Nosotros from './pages/Nosotros'
import Unidades from './pages/Unidades'
import Noticias from './pages/Noticias'
import Contacto from './pages/Contacto'
import Postular from './pages/Postular'
import Acceso from './pages/Acceso'
import NoEncontrado from './pages/NoEncontrado'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/postular" element={<Postular />} />
          <Route path="/acceso" element={<Acceso />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
