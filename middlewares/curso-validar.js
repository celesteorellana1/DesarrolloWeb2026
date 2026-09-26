const { body, validationResult } = require('express-validator');
const cursoRepository = require('../repositories/curso-repository');

const validarCrearCurso = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  
  body('codigo')
    .trim()
    .notEmpty().withMessage('El codigo es obligatorio')
    .custom(async (codigo) => {
      const existe = await cursoRepository.buscarPorCodigo(codigo);
      if (existe) {
        throw new Error('El codigo de curso ya esta registrado');
      }
    }),

  body('creditos')
    .isInt({ min: 1 }).withMessage('Los creditos deben ser un numero entero mayor a 0'),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

module.exports = { validarCrearCurso };