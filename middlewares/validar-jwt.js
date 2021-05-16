const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const validarJWT = (req, res, next) => {
    // leer token

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token incorrecto'
        })
    }
}

const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene provilegios para hacer eso'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'algo salió mal, hable con el admin'
        });
    }

}

const validarADMIN_ROLEoMismoUsuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene provilegios para hacer eso'
            });

        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'algo salió mal, hable con el admin'
        });
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLEoMismoUsuario
}