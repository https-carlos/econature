// Importação dos módulos necessários
const express = require('express'); // Framework para criar servidores HTTP
const bodyParser = require('body-parser'); // Middleware para parsear dados do corpo das requisições (como formulários)
const session = require('express-session'); // Middleware para gerenciar sessões de usuários
const cookieParser = require('cookie-parser'); // Middleware para manipular cookies
const sequelize = require('./Config/database'); // Instância do Sequelize para interagir com o banco de dados
const router = require('./Routes/authRoutes'); // Roteador com as rotas de autenticação
const app = express(); // Instância do aplicativo Express
const multer = require('multer'); // Middleware para upload de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const { FORCE } = require('sequelize/lib/index-hints'); // Utilizado para força de sincronização no banco (não usado diretamente no código)

// Definindo a porta que o servidor irá escutar
const port = process.env.PORT || 3000; // Usa a porta definida em uma variável de ambiente ou a porta 3000 por padrão

// Configuração para manipulação de cookies
app.use(cookieParser()); // Middleware para parser de cookies

// Configuração para gerenciar sessões de usuários
app.use(session({
    secret: 'chave-secreta', // Chave secreta usada para criptografar os dados da sessão
    resave: false, // Evita salvar a sessão de novo se não houver mudanças
    saveUninitialized: false, // Não salva sessões não inicializadas
    cookie: { maxAge: 60000 * 60 }, // Tempo de vida do cookie (1 hora)
}));

// Middleware para interpretar dados enviados via POST (formulários)
app.use(bodyParser.urlencoded({ extended: true })); // Permite enviar dados de formulários no formato URL-encoded
app.use(express.json()); // Permite enviar dados no formato JSON

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    // Função que define o destino do arquivo enviado
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Arquivos serão armazenados na pasta 'public/uploads/'
    },
    // Função que define o nome do arquivo
    filename: function (req, file, cb) {
        // O nome do arquivo será a data atual seguida pela extensão do arquivo
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Configuração do motor de template (view engine) para renderizar as páginas com EJS
app.set('view engine', 'ejs'); // Define que o motor de template será o EJS

// Configuração das pastas públicas para servir arquivos estáticos como CSS, JS, imagens, etc.
app.use(express.static('public')); // A pasta 'public' será usada para arquivos estáticos (ex: imagens, CSS, JS)
app.use(express.static('archives')); // A pasta 'archives' será usada para arquivos estáticos (se necessário)

// Roteamento: todas as rotas definidas em 'authRoutes.js' serão usadas no aplicativo
app.use('/', router); // O roteador de autenticação será usado nas rotas do servidor

// Sincronização do banco de dados com o Sequelize
sequelize.sync()
    .then(() => {
        // Se a sincronização do banco for bem-sucedida, o servidor será iniciado
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`); // Inicia o servidor na porta definida
        });
    })
    .catch(err => {
        // Caso ocorra um erro na sincronização do banco de dados, exibe o erro no console
        console.error('Erro ao sincronizar banco de dados:', err);
    });
