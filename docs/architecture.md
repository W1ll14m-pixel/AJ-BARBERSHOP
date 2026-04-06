# AJ-BARBERSHOP - Arquitectura del Sistema

## Descripción General
AJ-BARBERSHOP es una aplicación de gestión de barbería desarrollada con una arquitectura por capas, separando claramente los componentes frontend y backend con una base de datos centralizada.

## Arquitectura del Sistema

### 1. Frontend (React + Vite)
**Ubicación:** `src/`

**Componentes principales:**
- **pages/**: Contiene las páginas principales de la aplicación
  - `Dashboard.jsx`: Panel de control principal
  - `Clientes.jsx`: Gestión de clientes
  - `Barberos.jsx`: Gestión de barberos
  - `Citas.jsx`: Gestión de citas/reservas
  - `Sillas.jsx`: Gestión de sillas/estaciones
  - `Reportes.jsx`: Reportes y estadísticas

- **components/**: Componentes reutilizables
  - `Layout.jsx`: Estructura general de la aplicación
  - `BottomNav.jsx`: Navegación inferior
  - `Modal.jsx`: Componente modal para dialógos
  - `ConfirmDialog.jsx`: Dialogo de confirmación
  - `InstallPrompt.jsx`: Instalación de PWA
  - `ui.jsx`: Componentes UI básicos

- **context/**: Gestión de estado global
  - `AppContext.jsx`: Contexto principal de la aplicación

- **assets/**: Recursos estáticos (imágenes, iconos, etc.)

**Tecnologías:**
- React 18+
- Vite (build tool)
- Context API (state management)

### 2. Backend
**Ubicación:** `backend/`

**Estructura:**
```
backend/
├── src/
│   ├── config/       # Configuración de base de datos y aplicación
│   ├── controllers/  # Controladores (lógica de negocio)
│   ├── services/     # Servicios (lógica de negocio reutilizable)
│   ├── models/       # Modelos de datos
│   ├── repositories/ # Acceso a datos (Data Access Layer)
│   └── routes/       # Definición de rutas API
├── tests/            # Pruebas unitarias
└── main.js          # Punto de entrada
```

**Tecnologías sugeridas:**
- Node.js + Express.js
- MySQL o PostgreSQL
- JWT para autenticación

**API Endpoints (esperados):**
- `GET/POST /api/clientes` - Gestión de clientes
- `GET/POST /api/barberos` - Gestión de barberos
- `GET/POST /api/citas` - Gestión de citas
- `GET/POST /api/sillas` - Gestión de sillas
- `GET /api/reportes` - Reportes

### 3. Base de Datos
**Ubicación:** `database/`

**Tablas principales:**
- `clientes`: Información de clientes
- `barberos`: Información de barberos
- `sillas`: Estaciones de trabajo
- `citas`: Citas/reservas
- `servicios`: Servicios disponibles

**Tipo:** SQL (MySQL/PostgreSQL)

### 4. Pruebas
**Ubicación:** `tests/`

**Tipos:**
- **Unitarias:** `tests/unit/` - Pruebas de funciones individuales
- **Integración:** `tests/integration/` - Pruebas de endpoints API

## Flujo de Datos

```
Frontend (React) 
    ↓
API REST (Backend - Express)
    ↓
Services Layer (Lógica de negocio)
    ↓
Repository Layer (Acceso a datos)
    ↓
Base de Datos (MySQL/PostgreSQL)
```

## Decisiones de Arquitectura

1. **Separación en capas**: Facilita el mantenimiento y escalabilidad
2. **Context API para estado**: Gestión simple sin dependencias externas
3. **API REST**: Estándar para comunicación cliente-servidor
4. **Repositorios**: Abstracción de la lógica de acceso a datos

## Convenciones de Código

- **Nombres**: camelCase para variables y funciones, PascalCase para componentes
- **Archivos**: Nombres descriptivos en minúsculas con guiones
- **Comentarios**: Documentar funciones complejas y lógica no obvia
- **Commits**: Mensajes claros y técnicos con prefijos (feat, fix, refactor, etc.)

## Próximos Pasos

1. Implementar backend con rutas API
2. Conectar frontend con backend
3. Agregar autenticación
4. Implementar pruebas unitarias e integración
5. Agregar validaciones en cliente y servidor
6. Documentar API (OpenAPI/Swagger)
