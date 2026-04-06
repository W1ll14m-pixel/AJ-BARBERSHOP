-- Database schema for AJ-BARBERSHOP
-- This script creates the necessary tables for the barbershop management system

-- Table for clients
CREATE TABLE IF NOT EXISTS clientes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(15),
  email VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado BOOLEAN DEFAULT TRUE,
  INDEX idx_nombre (nombre),
  INDEX idx_apellido (apellido)
);

-- Table for barbers
CREATE TABLE IF NOT EXISTS barberos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100),
  telefono VARCHAR(15),
  estado BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
);

-- Table for chairs/stations
CREATE TABLE IF NOT EXISTS sillas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  ubicacion VARCHAR(100),
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for appointments
CREATE TABLE IF NOT EXISTS citas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  barbero_id INT NOT NULL,
  silla_id INT NOT NULL,
  fecha_cita DATETIME NOT NULL,
  duracion_estimada INT DEFAULT 30,
  servicio VARCHAR(100),
  estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (barbero_id) REFERENCES barberos(id) ON DELETE RESTRICT,
  FOREIGN KEY (silla_id) REFERENCES sillas(id) ON DELETE RESTRICT,
  INDEX idx_fecha (fecha_cita),
  INDEX idx_cliente (cliente_id),
  INDEX idx_barbero (barbero_id)
);

-- Table for services
CREATE TABLE IF NOT EXISTS servicios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  duracion_estimada INT DEFAULT 30,
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
