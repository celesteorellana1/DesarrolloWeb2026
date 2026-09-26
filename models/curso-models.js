const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  creditos: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'cursos',
  timestamps: true
});

module.exports = Curso;