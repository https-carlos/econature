const User = require('../models/user');
const bcrypt = require('bcrypt');
const Disease = require('../models/Diseases');
const UserDisease = require('../models/UserDisease');
const Product = require('../models/Product');
const { Op } = require('sequelize'); 
const Compra = require('../models/Compra');

exports.index = (req, res) => {
    const usuarioAutenticado = !!req.session.userId;
    res.render('inicial', { usuarioAutenticado });
};

exports.login = (req, res) => {
    res.render('login', { mensagemErro: null });
};

exports.registro = async (req, res) => {
    try {
        const doencas = await Disease.findAll();
        res.render('registro', { doencas });
    } catch (err) {
        console.error('Erro ao carregar doenças:', err);
        res.status(500).send('Erro ao carregar doenças');
    }
};

exports.inicial = async (req, res) => {
    const usuarioAutenticado = !!req.session.userId;

    try {
        const produtos = await Product.findAll();
        res.render('inicial', { usuarioAutenticado, produtos });
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro ao carregar os produtos');
    }
};

exports.catalogo = async (req, res) => {
    const { search = '', categoria = '' } = req.query;

    const where = {};

    if (search) {
        where.name = { [Op.like]: `%${search}%` }; // Busca por nome do produto
    }
    if (categoria) {
        where.category = categoria; // Filtra por categoria
    }

    try {
        const produtos = await Product.findAll({ where });

        // Garantir categorias únicas
        let categoriasUnicas = new Set();
        produtos.forEach(produto => categoriasUnicas.add(produto.category));
        categoriasUnicas = Array.from(categoriasUnicas); // Converte o Set em um array

        res.render('catalogo', { produtos, search, categoria, categoriasUnicas });
    } catch (err) {
        console.error('Erro ao carregar o catálogo:', err);
        res.status(500).send('Erro ao carregar catálogo');
    }
};

exports.home = (req, res) => {
    res.render('home');
};

/*exports.perfil = (req, res) => {
   if (req.session.userId) {
       res.render('perfil', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
};*/

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


exports.adicionarAoCarrinho = async (req, res) => {
    const { id, quantidade } = req.body;

    try {
        // Busca o produto no banco de dados
        const produto = await Product.findByPk(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado.');
        }

        // Obtém o carrinho atual da sessão (ou inicializa se vazio)
        const carrinho = req.session.carrinho || [];

        // Verifica se o produto já está no carrinho
        const itemIndex = carrinho.findIndex(item => item.id === parseInt(id));

        if (itemIndex > -1) {
            // Atualiza a quantidade se o produto já estiver no carrinho
            carrinho[itemIndex].quantidade += parseInt(quantidade);
        } else {
            // Adiciona o produto ao carrinho
            carrinho.push({
                id: produto.id,
                nome: produto.name,
                preco: produto.price,
                quantidade: parseInt(quantidade),
            });
        }

        // Salva o carrinho atualizado na sessão
        req.session.carrinho = carrinho;

        // Redireciona para a página do carrinho
        res.redirect('/carrinho');
    } catch (err) {
        console.error('Erro ao adicionar ao carrinho:', err);
        res.status(500).send('Erro ao adicionar ao carrinho.');
    }
};


exports.removerDoCarrinho = (req, res) => {
    const { produtoId } = req.body;

    try {
        const carrinho = req.session.carrinho || [];
        req.session.carrinho = carrinho.filter(item => item.id !== parseInt(produtoId));
        res.redirect('/carrinho');
    } catch (err) {
        console.error('Erro ao remover produto do carrinho:', err);
        res.status(500).send('Erro ao remover produto.');
    }
};


exports.atualizarQuantidade = (req, res) => {
    const { produtoId, quantidade } = req.body;
    const carrinho = req.session.carrinho || [];

    const produto = carrinho.find(item => item.id === parseInt(produtoId));
    if (produto) {
        produto.quantidade = Math.max(1, parseInt(quantidade)); // Garante que a quantidade não seja menor que 1
    }

    req.session.carrinho = carrinho;

    // Calcula o novo total
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    res.json({ success: true, total });
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

exports.checkout = (req, res) => {
    const carrinho = req.session.carrinho || [];
    const total = carrinho.reduce((sum, produto) => sum + produto.preco * produto.quantidade, 0);

    res.render('checkout', { carrinho, total });
};

// Exemplo de Controller para o Checkout
exports.checkoutPost = async (req, res) => {
    const carrinho = req.session.carrinho || [];
    const userId = req.session.userId;
    
    if (carrinho.length === 0) {
        return res.status(400).send('Carrinho vazio.');
    }

    try {
        for (const item of carrinho) {
            await Compra.create({
                userId,
                productId: item.id,
                quantidade: item.quantidade,
                total: item.preco * item.quantidade,
            });
        }

        
        req.session.carrinho = [];

        res.redirect('/perfil');
    } catch (err) {
        console.error('Erro no checkout:', err);
        res.status(500).send('Erro ao finalizar compra.');
    }
};
exports.perfil = async (req, res) => {
    
    if (!req.session.userId) {
        return res.redirect('/login'); 
    }

    const userId = req.session.userId;

    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Compra,
                include: [Product],
            }],
        });

        console.log(user);

        res.render('perfil', { user });
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        res.status(500).send('Erro ao carregar perfil');
    }
};

exports.finalizarCompra = async (req, res) => {
    const carrinho = req.session.carrinho || [];
    const userId = req.session.userId;
    
    if (carrinho.length === 0) {
        return res.status(400).send('Carrinho vazio.');
    }

    try {
        for (const item of carrinho) {
            const produto = await Product.findByPk(item.id);
            if (!produto) {
                return res.status(404).send('Produto não encontrado.');
            }

            // Criação da compra
            const compra = await Compra.create({
                user_id: userId,
                quantidade: item.quantidade,
                total: produto.price * item.quantidade,
                status: 'Em processamento', // Status inicial
            });

            // Relaciona o produto à compra (aqui a chave primária da tabela intermediária 'CompraProduct' será criada automaticamente)
            await compra.addProduct(produto, { through: { quantidade: item.quantidade } });
        }

        // Limpar o carrinho
        req.session.carrinho = [];

        res.redirect('/perfil');
    } catch (err) {
        console.error('Erro ao finalizar a compra:', err);
        res.status(500).send('Erro ao finalizar a compra.');
    }
};

