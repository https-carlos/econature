// Importa os modelos e bibliotecas necessárias
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Disease = require('../models/Diseases');
const UserDisease = require('../models/UserDisease');
const Product = require('../models/Product');
const { Op } = require('sequelize'); // Operadores do Sequelize para consultas avançadas
const Compra = require('../models/Compra');

// Rota para a página inicial
exports.index = (req, res) => {
    const usuarioAutenticado = !!req.session.userId; // Verifica se o usuário está autenticado
    res.render('inicial', { usuarioAutenticado }); // Renderiza a página inicial
};

// Rota para a página de login
exports.login = (req, res) => {
    res.render('login', { mensagemErro: null }); // Renderiza a página de login sem mensagem de erro
};

// Rota para carregar a página de registro de usuários
exports.registro = async (req, res) => {
    try {
        const doencas = await Disease.findAll(); // Busca todas as doenças cadastradas no banco de dados
        res.render('registro', { doencas }); // Renderiza a página de registro com as doenças
    } catch (err) {
        console.error('Erro ao carregar doenças:', err);
        res.status(500).send('Erro ao carregar doenças'); // Retorna erro em caso de falha
    }
};

// Rota para a página inicial com produtos
exports.inicial = async (req, res) => {
    const usuarioAutenticado = !!req.session.userId; // Verifica se o usuário está autenticado

    try {
        const produtos = await Product.findAll(); // Busca todos os produtos no banco de dados
        res.render('inicial', { usuarioAutenticado, produtos }); // Renderiza a página inicial com produtos
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro ao carregar os produtos'); // Retorna erro em caso de falha
    }
};

// Rota para a página do catálogo de produtos com filtro de busca e categorias
exports.catalogo = async (req, res) => {
    const { search = '', categoria = '' } = req.query; // Obtém os parâmetros de busca e categoria

    const where = {}; // Filtro para busca no banco de dados

    if (search) {
        where.name = { [Op.like]: `%${search}%` }; // Busca por nome do produto
    }
    if (categoria) {
        where.category = categoria; // Filtra por categoria
    }

    try {
        const produtos = await Product.findAll({ where }); // Busca os produtos no banco com os filtros aplicados

        // Obtém categorias únicas dos produtos encontrados
        let categoriasUnicas = new Set();
        produtos.forEach(produto => categoriasUnicas.add(produto.category));
        categoriasUnicas = Array.from(categoriasUnicas); // Converte o Set em um array

        res.render('catalogo', { produtos, search, categoria, categoriasUnicas }); // Renderiza a página do catálogo
    } catch (err) {
        console.error('Erro ao carregar o catálogo:', err);
        res.status(500).send('Erro ao carregar catálogo'); // Retorna erro em caso de falha
    }
};

// Rota para a página inicial "home"
exports.home = (req, res) => {
    res.render('home'); // Renderiza a página "home"
};

// Rota para autenticação do login
exports.loginPost = async (req, res) => {
    const { email, senha } = req.body; // Obtém os dados do formulário de login
    const user = await User.findOne({ where: { email } }); // Busca o usuário pelo email

    if (user && await bcrypt.compare(senha, user.password)) { // Verifica a senha criptografada
        req.session.userId = user.id; // Salva o ID do usuário na sessão
        req.session.user = user; // Salva o usuário completo na sessão
        res.redirect('inicial'); // Redireciona para a página inicial
    } else {
        res.render('login', { mensagemErro: 'Credenciais incorretas' }); // Exibe mensagem de erro em caso de falha
    }
};

// Rota para registrar um novo usuário
exports.registroPost = async (req, res) => {
    const { nome, usuario, email, senha, doencas } = req.body; // Dados do formulário de registro

    try {
        const hashedPassword = await bcrypt.hash(senha, 10); // Criptografa a senha
        const newUser = await User.create({
            name: nome,
            email: email,
            password: hashedPassword,
        });

        // Adiciona as doenças associadas ao usuário
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

        res.redirect('/login'); // Redireciona para a página de login
    } catch (error) {
        console.error(error);
        res.render('registro', { mensagemErro: 'Erro ao criar conta' }); // Exibe mensagem de erro em caso de falha
    }
};

// Rota para logout do usuário
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/inicial');
        }
        res.clearCookie('connect.sid'); // Limpa os cookies de sessão
        res.redirect('/'); // Redireciona para a página inicial
    });
};

// Rota para exibir a página do carrinho
exports.exibirCarrinho = (req, res) => {
    res.render('carrinho'); // Renderiza a página do carrinho
};

// Rota alternativa para exibir carrinho (com outra visão ou design)
exports.exibirCarrinho2 = (req, res) => {
    res.render('carrinho2');
};

// Adiciona um produto ao carrinho
exports.adicionarAoCarrinho = async (req, res) => {
    const { id, quantidade } = req.body; // Dados do produto e quantidade a ser adicionada

    try {
        const produto = await Product.findByPk(id); // Busca o produto no banco de dados

        if (!produto) {
            return res.status(404).send('Produto não encontrado.');
        }

        const carrinho = req.session.carrinho || []; // Obtém o carrinho atual da sessão

        const itemIndex = carrinho.findIndex(item => item.id === parseInt(id)); // Verifica se o produto já está no carrinho

        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade += parseInt(quantidade); // Atualiza a quantidade do produto
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.name,
                preco: produto.price,
                quantidade: parseInt(quantidade),
            });
        }

        req.session.carrinho = carrinho; // Salva o carrinho atualizado na sessão
        res.redirect('/carrinho'); // Redireciona para a página do carrinho
    } catch (err) {
        console.error('Erro ao adicionar ao carrinho:', err);
        res.status(500).send('Erro ao adicionar ao carrinho.');
    }
};

// Remove um produto do carrinho
exports.removerDoCarrinho = (req, res) => {
    const { produtoId } = req.body;

    try {
        const carrinho = req.session.carrinho || [];
        req.session.carrinho = carrinho.filter(item => item.id !== parseInt(produtoId)); // Remove o produto do carrinho
        res.redirect('/carrinho');
    } catch (err) {
        console.error('Erro ao remover produto do carrinho:', err);
        res.status(500).send('Erro ao remover produto.');
    }
};

// Atualiza a quantidade de um produto no carrinho
exports.atualizarQuantidade = (req, res) => {
    const { produtoId, quantidade } = req.body;
    const carrinho = req.session.carrinho || [];

    const produto = carrinho.find(item => item.id === parseInt(produtoId)); // Encontra o produto no carrinho
    if (produto) {
        produto.quantidade = Math.max(1, parseInt(quantidade)); // Garante que a quantidade seja pelo menos 1
    }

    req.session.carrinho = carrinho; // Atualiza o carrinho na sessão

    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0); // Calcula o total

    res.json({ success: true, total }); // Retorna o novo total como JSON
};

// Rota para listar todos os usuários
exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Busca todos os usuários no banco de dados
        res.render('usuarios', { users }); // Renderiza a página com a lista de usuários
    } catch (err) {
        console.error('Erro ao listar usuários:', err);
        res.status(500).send('Erro ao carregar usuários'); // Retorna erro em caso de falha
    }
};

// Rota para carregar a página de edição de um usuário
exports.editUser = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do usuário da URL
        const user = await User.findByPk(id); // Busca o usuário pelo ID
        res.render('editar-usuario', { user }); // Renderiza a página de edição
    } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        res.status(500).send('Erro ao carregar usuário'); // Retorna erro em caso de falha
    }
};

// Atualiza os dados de um usuário
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do usuário da URL
        const { name, email } = req.body; // Obtém os dados do formulário
        await User.update({ name, email }, { where: { id } }); // Atualiza os dados no banco
        res.redirect('/usuarios'); // Redireciona para a lista de usuários
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).send('Erro ao atualizar usuário'); // Retorna erro em caso de falha
    }
};

// Exclui um usuário
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do usuário da URL
        await User.destroy({ where: { id } }); // Remove o usuário do banco de dados
        res.redirect('/usuarios'); // Redireciona para a lista de usuários
    } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        res.status(500).send('Erro ao excluir usuário'); // Retorna erro em caso de falha
    }
};

// Rota para o checkout (resumo do carrinho)
exports.checkout = (req, res) => {
    const carrinho = req.session.carrinho || []; // Obtém o carrinho da sessão
    const total = carrinho.reduce((sum, produto) => sum + produto.preco * produto.quantidade, 0); // Calcula o total

    res.render('checkout', { carrinho, total }); // Renderiza a página de checkout
};

// Rota para finalizar a compra
exports.checkoutPost = async (req, res) => {
    const carrinho = req.session.carrinho || []; // Obtém o carrinho da sessão
    const userId = req.session.userId; // Obtém o ID do usuário autenticado
    
    if (carrinho.length === 0) {
        return res.status(400).send('Carrinho vazio.'); // Verifica se o carrinho está vazio
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

        req.session.carrinho = []; // Limpa o carrinho após a compra
        res.redirect('/perfil'); // Redireciona para o perfil do usuário
    } catch (err) {
        console.error('Erro no checkout:', err);
        res.status(500).send('Erro ao finalizar compra.'); // Retorna erro em caso de falha
    }
};

// Rota para exibir o perfil do usuário
exports.perfil = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para o login se o usuário não estiver autenticado
    }

    const userId = req.session.userId;

    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Compra, // Inclui as compras do usuário
                include: [Product], // Inclui os produtos de cada compra
            }],
        });

        res.render('perfil', { user }); // Renderiza a página de perfil com os dados do usuário
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        res.status(500).send('Erro ao carregar perfil'); // Retorna erro em caso de falha
    }
};

// Rota alternativa para finalizar compra
exports.finalizarCompra = async (req, res) => {
    const carrinho = req.session.carrinho || []; // Obtém o carrinho da sessão
    const userId = req.session.userId;
    
    if (carrinho.length === 0) {
        return res.status(400).send('Carrinho vazio.'); // Verifica se o carrinho está vazio
    }

    try {
        for (const item of carrinho) {
            const produto = await Product.findByPk(item.id);
            if (!produto) {
                return res.status(404).send('Produto não encontrado.');
            }

            const compra = await Compra.create({
                user_id: userId,
                quantidade: item.quantidade,
                total: produto.price * item.quantidade,
                status: 'Em processamento', // Status inicial da compra
            });

            await compra.addProduct(produto, { through: { quantidade: item.quantidade } }); // Relaciona o produto à compra
        }

        req.session.carrinho = []; // Limpa o carrinho após a compra
        res.redirect('/perfil'); // Redireciona para o perfil do usuário
    } catch (err) {
        console.error('Erro ao finalizar a compra:', err);
        res.status(500).send('Erro ao finalizar a compra.'); // Retorna erro em caso de falha
    }
};
