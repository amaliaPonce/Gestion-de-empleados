require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./src/routes/Routes');

// Importamos los errores.
const {
    errorController,
    notFoundController,
} = require('./src/controllers/errorControllers/index');

// Creamos el servidor.
const app = express();

// Middleware que deserializa un body en formato form-data creando la propiedad files.
app.use(fileUpload());

// Middleware que deserializa un body en formato raw creando la propiedad body
// en el objeto request.
app.use(express.json()).use(express.urlencoded({ extended: true }));

// Middleware que muestra información sobre la petición entrante.
app.use(morgan('dev'));

// Middleware que evita problemas con las CORS cuando intentamos conectar el cliente con
// el servidor.
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware que indica al servidor cuál es el directorio de ficheros estáticos.
app.use(express.static(process.env.UPLOADS_DIR));

app.use(router);

// Middleware de ruta no encontrada.
app.use(notFoundController);

// Middleware de error.
app.use(errorController);

// Ponemos el servidor a escuchar peticiones en un puerto dado.
app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
