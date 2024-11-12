
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Disease = require('../models/Diseases');
const UserDisease = require('../models/UserDisease');
const productController = require('../controllers/productController');
const Product = require('../models/Product');


exports.login = (req, res) => {
    res.render('login', { mensagemErro: null });
};

exports.registro = (req, res) => {
    res.render('registro');
};

exports.exibircarrinho2 = (req, res) => {
    res.render('carrinho2');
};

exports.inicial = async (req, res) => {
    const usuarioAutenticado = req.session.userId ? true : false;

    try {
        const produtos = await Product.findAll();

        res.render('inicial', { usuarioAutenticado, produtos });
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro ao carregar os produtos');
    }
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
    const { nome, usuario, email, senha, doencas } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await User.create({
            name: nome,
            email: email,
            password: hashedPassword,
        });


        if (doencas && Array.isArray(doencas)) {
            for (const doenca of doencas) {
                const disease = await Disease.findOne({ where: { name: doenca } });
                if (disease) {
                    await UserDisease.create({
                        user_id: newUser.id,
                        disease_id: disease.id
                    });
                }
            }
        }

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('registro', { mensagemErro: 'Erro ao criar conta' });
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

exports.exibirCarrinho = (req, res) => {
    res.render('carrinho');
};
exports.exibirCarrinho2 = (req, res) => {
    res.render('carrinho2');
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('usuarios', { users });
    } catch (err) {
        console.error('Erro ao listar usuários:', err);
        res.status(500).send('Erro ao carregar usuários');
    }
};


exports.editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        res.render('editar-usuario', { user });
    } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        res.status(500).send('Erro ao carregar usuário');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        await User.update({ name, email }, { where: { id } });
        res.redirect('/usuarios');
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).send('Erro ao atualizar usuário');
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.redirect('/usuarios');
    } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        res.status(500).send('Erro ao excluir usuário');
    }
};
