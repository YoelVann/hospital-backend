/*
ruta: api/todo/:busqueda
*/

const { Router } = require('express');
const { getTodo } = require('../controllers/busquedas');
const { getDocumentoCollecion } = require('../controllers/busquedas');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentoCollecion);

module.exports = router;