const Curso = require('../models/curso-model');

class CursoRepository {
  async obtenerTodos() {
    return await Curso.findAll();
  }

  async crear(datosCurso) {
    return await Curso.create(datosCurso);
  }

  async buscarPorCodigo(codigo) {
    return await Curso.findOne({ where: { codigo } });
  }
}

module.exports = new CursoRepository();