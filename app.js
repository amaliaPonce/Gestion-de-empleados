require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./src/routes/Routes');
const https = require('https');
const fs = require('fs');

// Importamos los errores.
const {
    errorController,
    notFoundController
} = require('./src/controllers/errorControllers');

// Creamos el servidor.
const app = express();

// Middleware que deserializa un body en formato form-data creando la propiedad files.
app.use(fileUpload());

// Middleware que muestra información sobre la petición entrante.
app.use(morgan('dev'));

// Middleware que evita problemas con las CORS cuando intentamos conectar el cliente con
// el servidor.
const corsOptions = {
    origin: 'http://localhost:3500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware que indica al servidor cuál es el directorio de ficheros estáticos.
app.use(express.static(process.env.UPLOADS_DIR));

// Middleware para analizar el cuerpo de la solicitud en formato JSON.
app.use(express.json());

// Utiliza las rutas definidas en el router.
app.use(router);

// Middleware de ruta no encontrada.
app.use(notFoundController);

// Middleware de error.
app.use(errorController);

// Lee los archivos de clave privada y certificado
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

// Crea un objeto de opciones para el servidor HTTPS
const credentials = { key: privateKey, cert: certificate };

// Crea un servidor HTTPS y ponlo a escuchar peticiones en el puerto
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT, () => {
  console.log(`Server listening at https://localhost:${process.env.PORT}`);
});
