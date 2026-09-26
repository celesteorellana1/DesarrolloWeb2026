const { Sequelize } = require('sequelize');

// Reemplaza con tus credenciales de PostgreSQL
const sequelize = new Sequelize('nombre_db', 'usuario_db', 'password_db', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desactiva los logs SQL en consola (opcional)
});

module.exports = sequelize;