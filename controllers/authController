
const User = require('../models/user'); 
const bcrypt = require('bcrypt');

exports.index = (req, res) => {
    const usuarioAutenticado = req.session.userId ? true : false; 
    res.render('inicial', { usuarioAutenticado });
};

exports.login = (req, res) => {
    res.render('login', { mensagemErro: null });
};

exports.registro = (req, res) => {
    res.render('registro');
};

exports.inicial = (req, res) => {
    const usuarioAutenticado = req.session.userId ? true : false; 
    res.render('inicial', { usuarioAutenticado });
};

exports.catalogo = (req, res) => {
    res.render('catalogo');
};

exports.home = (req, res) => {
    res.render('home');
};

exports.perfil = (req, res) => {
    if (req.session.userId) {
        res.render('perfil', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
};

exports.loginPost = async (req, res) => {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && await bcrypt.compare(senha, user.password)) {
        req.session.userId = user.id;
        req.session.user = user; 
        res.redirect('inicial'); 
    } else {
        res.render('login', { mensagemErro: 'Credenciais incorretas' });
    }
};

exports.registroPost = async (req, res) => {
    const { nome, usuario, email, senha } = req.body;  

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await User.create({
            name: nome,
            email: email,
            password: hashedPassword,
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error); 
        res.render('registro', { mensagemErro: 'Erro ao criar conta' });
    }
    if (senha !== req.body['confirmar-senha']) {
        return res.render('registro', { mensagemErro: 'As senhas não coincidem' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/inicial');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};
