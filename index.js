require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear server de express
const app = express();

// Configirar CORS
app.use(cors());

// lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

// directorio publico

app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/upload'));

// final
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})