require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear server de express
const app = express();

// Configirar CORS
app.use(cors());

//Base de datos
dbConnection();

console.log(process.env);
// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo chel'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})