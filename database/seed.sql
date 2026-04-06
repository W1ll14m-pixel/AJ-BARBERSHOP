-- Initial data for AJ-BARBERSHOP database
-- This script populates the database with sample data

-- Insert sample clients
INSERT INTO clientes (nombre, apellido, telefono, email) VALUES
('Juan', 'Pérez', '555-0001', 'juan.perez@email.com'),
('Carlos', 'García', '555-0002', 'carlos.garcia@email.com'),
('Miguel', 'López', '555-0003', 'miguel.lopez@email.com'),
('Diego', 'Martínez', '555-0004', 'diego.martinez@email.com');

-- Insert sample barbers
INSERT INTO barberos (nombre, apellido, especialidad, telefono) VALUES
('Antonio', 'Ruiz', 'Cortes Clásicos', '555-1001'),
('Roberto', 'Sánchez', 'Barbería Moderna', '555-1002'),
('Fernando', 'Torres', 'Diseño de Barba', '555-1003');

-- Insert sample chairs/stations
INSERT INTO sillas (numero, ubicacion) VALUES
(1, 'Esquina Izquierda'),
(2, 'Zona Central'),
(3, 'Ventana Derecha'),
(4, 'Zona Espera');

-- Insert sample services
INSERT INTO servicios (nombre, descripcion, precio, duracion_estimada) VALUES
('Corte Clásico', 'Corte de cabello tradicional', 25.00, 30),
('Corte Moderno', 'Corte con diseño contemporáneo', 35.00, 40),
('Afeitado Completo', 'Afeitado profesional con navaja', 20.00, 25),
('Corte + Barba', 'Corte de cabello y diseño de barba', 45.00, 50);
