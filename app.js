const express = require('express');
const sequelize = require('./config/database');
const cursoRoutes = require('./routes/curso.routes');

const app = express();
app.use(express.json());

// Registrar rutas
app.use('/cursos', cursoRoutes);

// Probamos conexión y sincronizamos modelos
async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // sync() crea las tablas si no existen en la BD
    await sequelize.sync(); 
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

main();