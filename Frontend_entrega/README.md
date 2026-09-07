# FireHouse Platform · Frontend

Frontend web de la plataforma de gestión de la **3ra Compañía de Bomberos de Calama**, desarrollado por el equipo **Fire Knights**.

> *"Unión es Fuerza"*

## Stack

- **React 18** + **Vite 5**
- **React Router 6** (enrutado)
- CSS puro con sistema de tokens (variables CSS) — sin librerías de UI
- Iconos SVG en línea propios (sin dependencias)

## Cómo ejecutar

```bash
cd Frontend
npm install       # solo la primera vez
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # build de producción
npm run preview   # previsualizar el build
npm run lint      # revisar el código
```

## Arquitectura de carpetas

El proyecto se organiza **por dominio/funcionalidad** (feature-based), un patrón
usado en proyectos React profesionales. Cada componente vive en su propia
carpeta junto a su CSS (co-locación).

```
src/
├── main.jsx                  # Punto de entrada de la app
├── App.jsx                   # Mapa de rutas (público + privado)
│
├── app/
│   └── routes.js             # ⭐ TODAS las URLs centralizadas (constantes)
│
├── assets/
│   └── styles/               # Estilos globales
│       ├── variables.css     #   Tokens: colores, tipografía, medidas
│       ├── base.css          #   Reset y estilos base
│       ├── utilidades.css    #   Clases reutilizables (.btn, .contenedor...)
│       ├── formularios.css   #   Estilos compartidos de formularios
│       └── index.css         #   Importa los anteriores en orden
│
├── components/               # Componentes reutilizables globales
│   ├── ui/                   #   Visuales genéricos
│   │   ├── Icono/            #     Colección de iconos SVG
│   │   ├── Logo/             #     Logo institucional
│   │   └── EstadoBadge/      #     Indicador de estado operativo
│   └── layout/               #   Estructura del sitio público
│       ├── Navbar/
│       └── Footer/
│
├── data/                     # Datos mock (futura capa de API)
│   ├── contenidoPublico.js   #   Unidades, noticias, emergencias...
│   ├── personal.js           #   Bomberos, turnos, comunicados...
│   └── roles.js              #   Rangos, niveles y permisos
│
└── features/                 # Código agrupado por área funcional
    ├── publico/              #   La cara pública
    │   ├── LayoutPublico.jsx #     Navbar + contenido + Footer
    │   └── pages/            #     Una carpeta por página
    │       ├── Inicio/
    │       ├── Nosotros/
    │       ├── Unidades/
    │       ├── Noticias/
    │       ├── Contacto/
    │       ├── Postular/
    │       ├── Acceso/
    │       └── NoEncontrado/
    │
    └── privado/              #   El panel interno (área de bomberos)
        ├── LayoutPrivado.jsx #     Sesión + estructura del panel
        ├── estilos-panel.css #     Estilos compartidos del panel
        ├── context/          #     Estado de sesión (rol activo)
        ├── components/       #     Piezas del panel
        │   ├── PanelLayout/  #       Sidebar + topbar + selector de rol
        │   ├── RutaProtegida/#       Guardia de permisos
        │   └── SinPermiso/   #       Aviso de acceso restringido
        └── pages/            #     Vistas internas
            ├── Dashboard/
            ├── Personal/
            ├── UnidadesOperativas/
            ├── Turnos/
            ├── Comunicados/
            └── Postulaciones/
```

### ¿Por qué esta organización?

- **Separación por dominio** (`features/publico` vs `features/privado`): cada
  área es independiente y fácil de ubicar. Si alguien trabaja en el panel, todo
  lo suyo está en una sola carpeta.
- **Co-locación** (jsx + css juntos): al abrir un componente, su estilo está al
  lado. No hay que buscar en una carpeta de CSS lejana.
- **URLs centralizadas** (`app/routes.js`): ninguna URL se escribe "a mano" en
  el código. Se usan constantes (`ROUTES.PANEL`), lo que evita errores de tipeo
  y facilita cambiar una ruta en un solo lugar.
- **Barrels** (`index.js` por carpeta): permiten imports limpios, por ejemplo
  `import { Inicio, Nosotros } from './features/publico/pages'`.
- **Datos aislados** (`data/`): hoy son mock; conectar el backend será cambiar
  solo esta carpeta por llamadas a la API, sin tocar las vistas.

## Roles y permisos (área privada)

El acceso interno se controla por rango. Los 9 rangos se agrupan en 4 niveles
de permiso (ver `data/roles.js`):

| Nivel | Rangos | Puede |
|-------|--------|-------|
| Administrador | Director, Capitán | Todo: editar personal, rangos, unidades, turnos, comunicados, postulaciones |
| Operativo | Tenientes 1/2/3, Ayudantes 1/2 | Unidades, turnos, comunicados; ve personal (no edita) |
| Administrativo | Secretario/a | Comunicados y **edita** personal |
| Solo lectura | Tesorero/a | Solo consulta |

El selector **"Ver como"** del panel permite cambiar de rol en vivo para mostrar
cómo cambia el acceso (útil en la demostración al cliente).

## Historias de Usuario cubiertas

HU-01 (institucional + redes), HU-02 (material mayor), HU-03 (contacto con
validación), HU-04 (postulación con 3 documentos + código único), HU-05
(noticias), HU-06 (emergencias), HU-07 (login), HU-08 (turno activo),
HU-13 (estados operativos por color).

---

**Fire Knights** — Ingeniería en Informática · 2026 · Calama, Chile
