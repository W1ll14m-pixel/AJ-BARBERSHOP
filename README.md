# AJ-BARBERSHOP

Sistema de gestión integral para barberías desarrollado con arquitectura por capas. Aplicación fullstack para administrar clientes, barberos, citas, servicios y reportes.

## 📋 Descripción

AJ-BARBERSHOP es una solución completa de software para la gestión operativa de barberías, permitiendo:
- Administración de clientes y historial
- Gestión de barberos y sus especialidades
- Reserva y seguimiento de citas
- Gestión de estaciones de trabajo (sillas)
- Reportes y estadísticas
- Interfaz responsiva con PWA capabilities

## 🏗️ Arquitectura

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

## 🛠️ Tecnologías

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

## 📦 Instalación

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

## 🔧 Configuración

Copiar `.env` y ajustar según tu entorno

Variables importantes:
- `PORT`: Puerto del servidor (default: 3000)
- `DB_HOST`: Host de la BD
- `DB_USER`: Usuario de BD
- `DB_PASSWORD`: Contraseña de BD
- `JWT_SECRET`: Clave secreta para tokens

## 🚀 Uso

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

## 📝 Control de Versiones

Rama de trabajo: `examen-william-lujan`

### Commits realizados:
1. **refactor**: Estructura base del proyecto con backend, database y docs
2. **docs**: Documentación completa de arquitectura
3. **config**: Configuración de entorno y gitignore

## 📚 Documentación

- [Arquitectura del Sistema](docs/architecture.md)
- [Convenciones de Código](docs/architecture.md#convenciones-de-código)

## ✅ Convenciones

- **Commits**: feat/, fix/, refactor/, docs/, config/
- **Nombres**: camelCase (variables), PascalCase (componentes)
- **Strings**: Mensajes en español

## 📄 Licencia

Proyecto académico - Examen Ingeniería de Software II
