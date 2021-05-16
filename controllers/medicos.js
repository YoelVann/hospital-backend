const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}
const getMedicoById = async(req, res = response) => {

    const id = req.params.id;
    try {


        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal... hable con el admin'
        });
    }

}

const crearMedico = async(req, res = response) => {
    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'algo salió mal... hable con el admin'
        });
    }
}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal, contacte al admin'
        });
    }
}

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {


        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });


    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Algo salió mal, hable con el admin'
        })
    }
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}