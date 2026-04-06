## ANÁLISIS TÉCNICO DE ARQUITECTURA - AJ-BARBERSHOP

**Documento:** Análisis de Estructura y Componentes  
**Fecha:** 6 de abril de 2026  
**Autor:** William Lujan  
**Versión:** 1.0

---

## Tabla de Contenidos
1. [Tipo de Arquitectura](#tipo-de-arquitectura)
2. [Módulos y Componentes](#módulos-y-componentes)
3. [Análisis de Capas](#análisis-de-capas)
4. [Problemas Identificados](#problemas-identificados)
5. [Mejoras Propuestas](#mejoras-propuestas)
6. [Plan de Refactorización](#plan-de-refactorización)

---

## Tipo de Arquitectura

### Clasificación Actual: **Arquitectura Monolítica con Separación de Capas (Incompleta)**

```
PROPUESTA VS REALIDAD
────────────────────────────────────────────────────────────────

PROPUESTA (Diseño):
┌──────────────────────────────────────────┐
│  Presentation Layer (Frontend React)     │
├──────────────────────────────────────────┤
│  Business Logic Layer (Backend Express)  │
├──────────────────────────────────────────┤
│  Data Access Layer (Repositories)        │
├──────────────────────────────────────────┤
│  Database Layer (MySQL/PostgreSQL)       │
└──────────────────────────────────────────┘

REALIDAD (Implementado):
┌──────────────────────────────────────────┐
│   Presentation Layer (IMPLEMENTADO)   │
│     - React 19.2.0, Vite, Tailwind CSS  │
├──────────────────────────────────────────┤
│   Business Logic Layer (VACÍO)        │
│     - Estructura creada, sin código      │
├──────────────────────────────────────────┤
│   Data Access Layer (VACÍO)           │
│     - No existe acceso a BD              │
├──────────────────────────────────────────┤
│   Database Layer (DESCONECTADO)       │
│     - Schema SQL existe, no usado        │
└──────────────────────────────────────────┘
+────────────────────────────────────────────
│    localStorage = Solución Temporal
└────────────────────────────────────────────
```

### Características Identificadas

**Puntos Fuertes:**
-  Frontend moderno con React 19 y Vite
-  State management con Context API bien estructurado
-  Responsive design con Tailwind CSS
-  PWA capabilities (con vite-plugin-pwa)
-  Routing implementado (React Router 7.13)
-  Estructura base de backend preparada
-  Scripts de BD diseñados correctamente

**Limitaciones Críticas:**
-  Backend completamente desconectado
-  Persistencia en localStorage (temporal)
-  Sin autenticación
-  Sin validación en servidor
-  Sin API REST funcional
-  Sin pruebas automatizadas
-  Sin manejo de errores centralizado

---

## Módulos y Componentes

###  Frontend - Estructura de Carpetas

```
src/
├── pages/              # Contenedores principales (Smart Components)
│   ├── Dashboard.jsx         - Panel principal, estadísticas diarias
│   ├── Clientes.jsx          - Listado y CRUD de clientes
│   ├── Barberos.jsx          - Listado y CRUD de barberos
│   ├── Citas.jsx             - Gestión de citas/reservas
│   ├── Sillas.jsx            - Control de ocupación de sillas
│   └── Reportes.jsx          - Reportes y gráficos
│
├── components/         # Componentes reutilizables (Presentacionales)
│   ├── Layout.jsx            - Layout principal con header/footer
│   ├── BottomNav.jsx         - Navegación móvil inferior
│   ├── Modal.jsx             - Diálogos modales
│   ├── ConfirmDialog.jsx      - Confirmaciones
│   ├── InstallPrompt.jsx      - Prompt para instalación PWA
│   └── ui.jsx                - Componentes UI atómicos
│
├── context/            # State Management
│   └── AppContext.jsx        - Context global + reducer + utilidades
│
├── assets/             # Recursos estáticos
├── App.jsx             # Componente raíz
├── main.jsx            # Punto de entrada
├── App.css
└── index.css

TOTAL: 6 páginas + 6 componentes base
```

###  Backend - Estructura Teórica (SIN IMPLEMENTAR)

```
backend/
├── src/
│   ├── config/         # Configuración
│   │   ├── database.js       - Conexión a BD (NO EXISTE)
│   │   └── environment.js    - Variables de entorno (NO EXISTE)
│   │
│   ├── controllers/    # Lógica HTTP (NO EXISTE)
│   │   ├── clienteController.js
│   │   ├── barberoController.js
│   │   ├── citaController.js
│   │   └── reporteController.js
│   │
│   ├── services/       # Lógica de negocio (NO EXISTE)
│   │   ├── clienteService.js
│   │   ├── citaService.js
│   │   └── reporteService.js
│   │
│   ├── models/         # Schemas/Interfaces (NO EXISTE)
│   │   ├── Cliente.js
│   │   ├── Barbero.js
│   │   └── Cita.js
│   │
│   ├── repositories/   # Data Access (NO EXISTE)
│   │   ├── clienteRepository.js
│   │   └── citaRepository.js
│   │
│   └── routes/         # Definición de rutas (NO EXISTE)
│       ├── clientesRoutes.js
│       ├── barberosRoutes.js
│       └── citasRoutes.js
│
├── tests/              # Pruebas (VACÍO)
├── main.js             # Punto de entrada (ESQUELETO)
└── package.json        # Dependencias (NO EXISTE)

ESTADO: 0% implementado
```

###  Flujo de Datos Actual

```
┌─────────────────────────────────────────────┐
│  User Interaction (Click, Form Submit)      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Component Handler (Page/Component)         │
│  ├─ useState para estado local              │
│  └─ dispatch(action) para estado global     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  AppContext Reducer                         │
│  ├─ Actualiza estado en memoria            │
│  └─ Persiste en localStorage               │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  localStorage (Persistencia Temporal)       │
│  ├─ Datos JSON serializados                 │
│  └─ Se pierden si limpian caché             │
└─────────────────────────────────────────────┘

 FALTA: Backend Express API REST
 FALTA: Base de datos real
 FALTA: Autenticación JWT
```

---

## Análisis de Capas

### Capa de Presentación (Frontend) -  BIEN IMPLEMENTADA

**Fortalezas:**
1. **Separación de Responsabilidades**
   - Pages vs Components bien diferenciados
   - Componentes pequeños y reutilizables
   - Props drilling minimizado

2. **State Management**
   ```javascript
   // AppContext.jsx usa useReducer bien estructurado
   const [state, dispatch] = useReducer(appReducer, initialState);
   
   // Patrones: ADD_CLIENTE, UPDATE_CLIENTE, DELETE_CLIENTE
   ```

3. **Routing Moderno**
   - React Router v7.13
   - 6 rutas principales + fallback

4. **Styling**
   - Tailwind CSS para responsividad
   - Mobile-first approach
   - Design system consistente

5. **Accesibilidad y PWA**
   - Hook InstallPrompt para PWA
   - Soporte para instalación en pantalla inicio

**Problemas:**
- Datos hardcodeados en AppContext
- Sin custom hooks para lógica reutilizable
- Sin validación de datos
- Sin manejo de errores

### Capa de Lógica de Negocio (Backend) -  NO EXISTE

**Estructura teórica creada:**
- Controllers (vacío)
- Services (vacío)
- Models (vacío)
- Routes (vacío)

**Qué falta implementar:**
1. Rutas REST API (Express)
2. Controladores (CRUD + lógica)
3. Servicios (reglas de negocio)
4. Middlewares (autenticación, validación)

### Capa de Acceso a Datos -  NO EXISTE

**Estado:**
- localStorage = Solución temporal
- No existe DAL (Data Access Layer)
- No hay repositorios

**Qué falta:**
```javascript
// Debería existir: backend/src/repositories/clienteRepository.js
class ClienteRepository {
  async getAll() { /* SELECT * FROM clientes */ }
  async getById(id) { /* SELECT * FROM clientes WHERE id */ }
  async create(data) { /* INSERT INTO clientes */ }
  async update(id, data) { /* UPDATE clientes */ }
  async delete(id) { /* DELETE FROM clientes */ }
}
```

### Capa de Base de Datos -  PARCIALMENTE LISTA

**Qué existe:**
- `database/schema.sql` - Diseño correcto
  - Tabla clientes (id, nombre, apellido, email, teléfono, etc.)
  - Tabla barberos (id, nombre, especialidad, etc.)
  - Tabla sillas (id, número, ocupada)
  - Tabla citas (id, cliente_id, barbero_id, fecha, etc.)
  - Tabla servicios (id, nombre, precio, duración)

**Qué falta:**
- Conexión desde backend
- Índices optimizados
- Triggers para auditoría
- Transacciones

---

## Problemas Identificados

###  CRÍTICOS

1. **Backend Desconectado**
   - Impacto: Imposible producción
   - Severidad: CRÍTICA
   - Solución: Implementar Express + rutas

2. **Sin Persistencia Real**
   - localStorage se borra con caché del navegador
   - Impacto: Pérdida de datos
   - Severidad: CRÍTICA

3. **Sin Autenticación**
   - Cualquiera puede acceder
   - Impacto: Riesgo de seguridad
   - Severidad: CRÍTICA

###  IMPORTANTES

4. **Sin Validación**
   - Frontend y backend
   - Riesgo de datos inválidos

5. **Sin Manejo de Errores**
   - Fallos silenciosos
   - Mal UX

6. **Sin Testing**
   - Cambios rompen funcionalidad
   - Falta de confianza en código

###  MEJORAS

7. **Código duplicado**
   - Reducir con custom hooks

8. **Falta documentación de API**
   - Swagger/OpenAPI recomendado

---

## Mejoras Propuestas

### Fase 1: Conectar Backend (URGENTE - 1-2 semanas)

```bash
# 1. Instalar dependencias backend
cd backend
npm install express cors dotenv mysql2 bcryptjs jsonwebtoken

# 2. Crear archivo config
# backend/src/config/database.js
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

# 3. Crear repositorio
# backend/src/repositories/clienteRepository.js
class ClienteRepository {
  async getAll() {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM clientes');
    conn.release();
    return rows;
  }
  // ... más métodos
}

# 4. Crear servicio
# backend/src/services/clienteService.js
class ClienteService {
  constructor(clienteRepository) {
    this.repository = clienteRepository;
  }
  
  async obtenerClientes() {
    return this.repository.getAll();
  }
}

# 5. Crear controlador
# backend/src/controllers/clienteController.js
class ClienteController {
  constructor(clienteService) {
    this.service = clienteService;
  }
  
  async getAll(req, res) {
    try {
      const clientes = await this.service.obtenerClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

# 6. Crear rutas
# backend/src/routes/clientesRoutes.js
router.get('/', (req, res) => controller.getAll(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

# 7. Actualizar main.js
# backend/main.js
const express = require('express');
const clientesRoutes = require('./src/routes/clientesRoutes');
const app = express();

app.use(express.json());
app.use('/api/clientes', clientesRoutes);
// ... más rutas

app.listen(3000, () => console.log('Servidor escuchando en :3000'));
```

### Fase 2: Custom Hooks en Frontend (1 semana)

```javascript
// src/hooks/useClientes.js
export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clientes');
      if (!response.ok) throw new Error('Error al obtener clientes');
      setClientes(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCliente = useCallback(async (cliente) => {
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      if (!response.ok) throw new Error('Error al crear cliente');
      await fetchClientes();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchClientes]);

  const deleteCliente = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar cliente');
      await fetchClientes();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchClientes]);

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading, error, addCliente, deleteCliente };
}

// Uso en componente:
// const { clientes, loading } = useClientes();
```

### Fase 3: Validación (1 semana)

```javascript
// src/validators/clienteValidator.js
import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(2, 'Nombre mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Apellido mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Teléfono inválido')
});

// Uso: en componente
const [errors, setErrors] = useState({});
const handleSave = (cliente) => {
  try {
    clienteSchema.parse(cliente);
    // Enviar al backend
  } catch (error) {
    setErrors(error.flatten().fieldErrors);
  }
};
```

### Fase 4: TypeScript (Opcional, 2 semanas)

```typescript
// src/types/index.ts
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  creadoEn: Date;
}

export interface Cita {
  id: number;
  clienteId: number;
  barberoId: number;
  sillaId: number;
  fecha: Date;
  servicio: string;
}
```

### Fase 5: Testing (1-2 semanas)

```javascript
// __tests__/hooks/useClientes.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { useClientes } from '@/hooks/useClientes';

test('debe cargar clientes al montar', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, nombre: 'Juan' }])
    })
  );

  const { result } = renderHook(() => useClientes());

  await waitFor(() => {
    expect(result.current.clientes).toHaveLength(1);
  });
});
```

### Fase 6: Swagger Documentation (3 días)

```javascript
// backend/src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AJ-Barbershop API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Accesible en: http://localhost:3000/api-docs
```

---

## Plan de Refactorización

### Timeline Recomendado

```
SEMANA 1: Backend MVP
├─ Conectar BD (database.js)
├─ Crear 3 rutas (GET, POST, DELETE)
└─ Testear con Postman

SEMANA 2: Frontend API Integration
├─ Reemplazar localStorage con fetch() calls
├─ Agregar loading states
└─ Error handling básico

SEMANA 3: Validación y Seguridad
├─ Validación frontend (Zod)
├─ JWT authentication
└─ CORS configurado

SEMANA 4: Testing y Docs
├─ Pruebas unitarias
├─ Swagger API docs
└─ Documentación actualizada

SEMANA 5: Optimizations
├─ Custom hooks
├─ Error boundary
└─ Performance improvements

SEMANA 6: TypeScript (Opcional)
├─ Migrar tipos críticos
└─ Type safety mejorado
```

---

## Conclusión

**Diagnóstico Actual:**
-  Frontend moderno y bien estructurado
-  Backend completamente ausente
-  Datos temporales en localStorage
-  Arquitectura incompleta

**Calificación de Madurez:** **4/10**

**Acción Inmediata:** Implementar backend Express conectado a MySQL en las próximas 2 semanas para alcanzar estado productivo.

---

**Documento preparado por:** William Lujan  
**Fecha:** 6 de abril de 2026
