// Main entry point for the backend server
// This file will contain the configuration and initialization of the backend application

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes will be added here
// app.use('/api/clientes', clientesRoutes);
// app.use('/api/barberos', barberosRoutes);
// app.use('/api/citas', citasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
