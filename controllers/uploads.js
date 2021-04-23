const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if (!tiposValidos) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo válido (médicos, hospitales, usuarios)'
        });
    }

    // validar imagen
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });

    }

    //procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //valida extension
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión valida'
        });
    }

    //generar nombre archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // guardar laimagen

    const path = `./uploads/${tipo}/${nombreArchivo}`;


    //mover la imagen

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                msg: 'Falla al mover imagen'
            });
        }
        //actualizar Base de  Datos

        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });







}

const retornaImagen = (req, res = response) => {


    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por default

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../uploads/noimg.jpg`);
        res.sendFile(pathImg)
    }


}


module.exports = {
    fileUpload,
    retornaImagen,
}