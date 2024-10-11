const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sequelize = require('./Config/database');
const authRoutes = require('./Routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('archives'));

app.use('/', authRoutes);

sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar banco de dados:', err);
    });
