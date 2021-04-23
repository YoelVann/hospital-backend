// getTodo

const { response } = require("express");

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async(req, res = response) => {


    try {
        const busqueda = req.params.busqueda;

        const regex = new RegExp(busqueda, 'i');

        const [usuarios, medicos, hospitales] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Medico.find({ nombre: regex }),
            Hospital.find({ nombre: regex })
        ]);

        res.json({
            ok: true,
            msg: 'getTodo',
            usuarios,
            medicos,
            hospitales
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal, contacte al admin'
        })
    }


}

const getDocumentoCollecion = async(req, res = response) => {


    // try {
    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;

    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre img');

            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

            break;

        default:
            return res.status(500).json({
                ok: false,
                msg: 'la tabla tiene que ser usuarios/medicos/hospitales'
            });
            break;
    }

    // } catch (error) {
    //     console.log(error);

    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Algo salió mal, contacte al admin'
    //     })
    // }

    res.json({
        ok: true,
        msg: 'getTodo',
        resultados: data
    });

}

module.exports = {
    getTodo,
    getDocumentoCollecion,

}