//app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sequelize = require('./Config/database');
const router = require('./Routes/authRoutes');
const app = express();
const multer = require('multer');
const path = require('path');
const { FORCE } = require('sequelize/lib/index-hints');

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('archives'));

app.use('/', router);

sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar banco de dados:', err);
    });
