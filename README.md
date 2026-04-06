# AJ-BARBERSHOP

Sistema de gestión integral para barberías desarrollado con arquitectura por capas. Aplicación fullstack para administrar clientes, barberos, citas, servicios y reportes.

## Descripción

AJ-BARBERSHOP es una solución completa de software para la gestión operativa de barberías, permitiendo:
- Administración de clientes y historial
- Gestión de barberos y sus especialidades
- Reserva y seguimiento de citas
- Gestión de estaciones de trabajo (sillas)
- Reportes y estadísticas
- Interfaz responsiva con PWA capabilities

## Arquitectura

Proyecto estructurado en capas siguiendo buenas prácticas de ingeniería de software:

```
AJ-BARBERSHOP/
├── src/                # Frontend React
├── backend/            # Backend Node.js + Express
│   ├── src/
│   │   ├── config/     # Configuración
│   │   ├── controllers/ # Controladores
│   │   ├── services/   # Servicios
│   │   ├── models/     # Modelos
│   │   └── repositories/ # Data Access Layer
│   └── tests/
├── database/           # Scripts de BD
├── docs/               # Documentación
└── tests/              # Pruebas
```

Consulta [docs/architecture.md](docs/architecture.md) para más detalles.

## Tecnologías

### Frontend
- React 18+
- Vite (Build tool)
- Context API (State management)

### Backend
- Node.js + Express.js
- MySQL/PostgreSQL
- JWT Authentication

### Base de Datos
- MySQL o PostgreSQL
- Scripts de inicialización (schema.sql, seed.sql)

## Instalación

### Requisitos previos
- Node.js 16+
- npm o yarn
- MySQL 8+ o PostgreSQL

### Configuración Frontend
```bash
npm install
npm run dev
```

### Configuración Backend
```bash
cd backend
npm install
npm start
```

### Configuración Base de Datos
```bash
# Ejecutar schema
mysql -u root -p aj_barbershop < database/schema.sql

# Cargar datos iniciales (opcional)
mysql -u root -p aj_barbershop < database/seed.sql
```

## Configuración

Copiar `.env` y ajustar según tu entorno

Variables importantes:
- `PORT`: Puerto del servidor (default: 3000)
- `DB_HOST`: Host de la BD
- `DB_USER`: Usuario de BD
- `DB_PASSWORD`: Contraseña de BD
- `JWT_SECRET`: Clave secreta para tokens

## Uso

### Desarrollo
```bash
# Frontend
npm run dev

# Backend
cd backend && npm start
```

### Construcción para producción
```bash
npm run build
```

## Control de Versiones

Rama de trabajo: `examen-william-lujan`

### Commits realizados:
1. **refactor**: Estructura base del proyecto con backend, database y docs
2. **docs**: Documentación completa de arquitectura
3. **config**: Configuración de entorno y gitignore

## Documentación

- [Arquitectura del Sistema](docs/architecture.md)
- [Convenciones de Código](docs/architecture.md#convenciones-de-código)

---

## ANÁLISIS TÉCNICO - Actividad 2

### 1. Tipo de Arquitectura

**Arquitectura ACTUAL: Monolítica de Capas (Hybrid)**

```
┌─────────────────────────────────────────┐
│   Presentation Layer (Frontend React)   │
│ - Pages: Dashboard, Clientes, Barberos  │
│ - Components: Modal, BottomNav, Layout  │
│ - Styling: Tailwind CSS                 │
└──────────────┬──────────────────────────┘
               │ Context API + useReducer
┌──────────────▼──────────────────────────┐
│ State Management (AppContext)           │
│ - Gestión de estado global              │
│ - localStorage para persistencia        │
└──────────────┬──────────────────────────┘
               │ Datos en memoria
┌──────────────▼──────────────────────────┐
│   Data Layer (localStorage)             │
│ - Sin conexión a backend real           │
│ - Datos desaparecen si limpian cache    │
└─────────────────────────────────────────┘
```

**Características:**
- **Frontend**: Moderno y responsivo (React + Vite + Tailwind)
- **Estado Global**: Context API + useReducer bien implementado
- **Routing**: React Router DOM con 6 rutas principales
- **Backend**: Estructura base sin implementar
- **Persistencia**: localStorage en lugar de BD real
- **Autenticación**: No implementada
- **API REST**: No existe

---

### 2. Módulos y Componentes Identificados

#### **Frontend (React)**

**Páginas (6 módulos):**
| Módulo | Funcionalidad | Estado |
|--------|---------------|--------|
| `Dashboard.jsx` | Panel principal con estadísticas diarias | Implementado |
| `Clientes.jsx` | CRUD de clientes | Implementado |
| `Barberos.jsx` | CRUD de barberos | Implementado |
| `Citas.jsx` | Gestión de citas/reservas | Implementado |
| `Sillas.jsx` | Control de ocupación de estaciones | Implementado |
| `Reportes.jsx` | Reportes y estadísticas | Implementado |

**Componentes Reutilizables:**
- `Layout.jsx` - Estructura base con header y navegación
- `BottomNav.jsx` - Navegación inferior (mobile-first)
- `Modal.jsx` - Diálogos y formularios modales
- `ConfirmDialog.jsx` - Diálogos de confirmación
- `InstallPrompt.jsx` - Prompt para instalación PWA
- `ui.jsx` - Componentes UI básicos (StatCard, Card, Avatar)

**Estado Global (AppContext):**
- Datos de barberos, clientes, servicios, sillas
- Registros de sesiones completadas
- Citas agendadas
- Utilidades: formatters, getters, reducers

#### **Backend (Node.js) - NO IMPLEMENTADO**

Estructura creada pero sin lógica:
```
backend/
├── src/
│   ├── config/       # Conexión BD, variables entorno
│   ├── controllers/  # Controladores API (vacío)
│   ├── services/     # Lógica de negocio (vacío)
│   ├── models/       # Modelos/Schemas (vacío)
│   ├── repositories/ # Data Access Layer (vacío)
│   └── routes/       # Definición rutas API (vacío)
└── tests/            # Pruebas (vacío)
```

#### **Base de Datos**

Scripts SQL creados:
- `schema.sql` - 5 tablas (clientes, barberos, sillas, citas, servicios)
- `seed.sql` - Datos iniciales de demostración
- **Estado**: Diseño teórico, no conectado

---

### 3. Mejoras Arquitectónicas Propuestas

#### Prioridad ALTA

1. **Conectar Backend Real**
   ```javascript
   // Crear servicios API en: src/services/api.js
   export const clienteAPI = {
     getAll: () => fetch('/api/clientes'),
     create: (data) => fetch('/api/clientes', {method:'POST', body:JSON.stringify(data)}),
     update: (id, data) => fetch(`/api/clientes/${id}`, {method:'PUT', ...}),
     delete: (id) => fetch(`/api/clientes/${id}`, {method:'DELETE'})
   };
   ```

2. **Implementar Backend Express**
   ```javascript
   // backend/src/routes/clientesRoutes.js
   router.get('/', clienteController.getAll);
   router.post('/', clienteController.create);
   router.put('/:id', clienteController.update);
   router.delete('/:id', clienteController.delete);
   ```

3. **Reemplazar localStorage con API**
   - Modificar AppContext para consultar backend
   - Eliminar persistencia local
   - Agregar manejo de errores HTTP

4. **Autenticación JWT**
   - Implementar login/logout
   - Proteger rutas con middleware
   - Almacenar tokens con seguridad

#### Prioridad MEDIA

5. **Custom Hooks para Lógica Reutilizable**
   ```javascript
   // src/hooks/useClientes.js
   export function useClientes() {
     const [clientes, setClientes] = useState([]);
     const [loading, setLoading] = useState(false);
     
     const fetchClientes = async () => {
       setLoading(true);
       const response = await clienteAPI.getAll();
       setClientes(await response.json());
       setLoading(false);
     };
     
     return { clientes, loading, fetchClientes };
   }
   ```

6. **Validación en Capas**
   - Frontend: Validación con bibliotecas (Zod, Yup)
   - Backend: Validación duplicada (nunca confiar en cliente)

7. **Manejo de Errores Global**
   - Try/catch en llamadas API
   - ErrorBoundary en React
   - Logging centralizado

8. **Tipado con TypeScript**
   - Interfaces para Clientes, Barberos, Citas, etc.
   - Mejor autocompletado y detección de errores

#### Prioridad MEDIA-BAJA

9. **Pruebas Automatizadas**
   ```bash
   # Frontend: Vitest + React Testing Library
   npm install --save-dev vitest @testing-library/react
   
   # Backend: Jest + Supertest
   npm install --save-dev jest supertest
   ```

10. **Documentación con Swagger**
    ```javascript
    // Exponer API docs en /api-docs
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    ```

11. **Patrón de Caché**
    - Agregar Redis para sesiones y caché
    - Reducir carga de BD

12. **Logging Estructurado**
    - Librería Winston o Bunyan
    - Track de errores en producción

---

### Matriz de Madurez Actual

| Aspecto | Madurez | Detalle |
|---------|---------|----------|
| **Frontend** | Alta | React moderno, componentes bien estructurados |
| **Backend** | Nula | Estructura sin lógica implementada |
| **BD** | Mediana | Schema correcto, no conectada |
| **Testing** | Nula | Sin pruebas automatizadas |
| **Documentación** | Mediana | README y architecture.md creados |
| **Seguridad** | Nula | Sin autenticación |
| **Escalabilidad** | Mediana | Arquitectura preparada para crecer |

---

### Convenciones

- **Commits**: feat/, fix/, refactor/, docs/, config/
- **Nombres**: camelCase (variables), PascalCase (componentes)
- **Strings**: Mensajes en español

## Licencia

Proyecto académico - Examen Ingeniería de Software II
