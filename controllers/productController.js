// Importando as dependências necessárias
const multer = require('multer'); // Biblioteca para upload de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const Product = require('../models/Product'); // Modelo para manipular os produtos
const Diseases = require('../models/Diseases'); // Modelo para manipular as doenças
const ProductDisease = require('../models/ProductDisease'); // Modelo para gerenciar a relação entre produtos e doenças
const { Op } = require('sequelize'); // Operadores do Sequelize para consultas avançadas

// Configuração do armazenamento para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Define o diretório de destino para os uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Define o nome do arquivo como um timestamp + extensão original
  }
});

// Inicializando o middleware de upload de arquivos
const upload = multer({ storage: storage });

// Exibe o formulário de criação de produto
exports.exibirFormularioProduto = async (req, res) => {
  try {
    const doencas = await Diseases.findAll(); // Obtém todas as doenças do banco de dados
    res.render('criar-produto', { doencas }); // Renderiza o formulário com as doenças disponíveis
  } catch (err) {
    console.error('Erro ao carregar o formulário:', err);
    res.status(500).send('Erro ao carregar o formulário'); // Retorna erro caso algo falhe
  }
};

// Insere um novo produto no banco de dados
exports.inserirProduto = async (req, res) => {
  try {
    console.log('Arquivo enviado:', req.file); // Exibe informações do arquivo enviado
    console.log('Corpo da requisição:', req.body); // Exibe os dados enviados no corpo da requisição

    // Valida se o arquivo de imagem foi enviado
    if (!req.file) {
      return res.status(400).send('A imagem do produto é obrigatória.');
    }

    // Valida se pelo menos uma doença foi selecionada
    const doencas = req.body.doencas;
    if (!doencas || doencas.length === 0) {
      return res.status(400).send('Pelo menos uma doença precisa ser selecionada.');
    }

    // Cria o produto no banco de dados
    const produto = await Product.create({
      name: req.body.nome,
      description: req.body.descricao,
      price: req.body.preco,
      category: req.body.categoria,
      image: req.file.filename, // Nome do arquivo da imagem
    });

    // Associa o produto às doenças selecionadas
    for (const doencaId of doencas) {
      await ProductDisease.create({
        ProductId: produto.id, // ID do produto
        DiseaseId: doencaId, // ID da doença
      });
    }

    // Redireciona para a página inicial após a criação
    res.redirect('/inicial');
  } catch (err) {
    console.error('Erro ao adicionar o produto:', err);
    res.status(500).send('Erro ao adicionar o produto'); // Retorna erro caso algo falhe
  }
};

// Lista todos os produtos disponíveis
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll(); // Obtém todos os produtos do banco de dados
    res.render('produtos', { products }); // Renderiza a página de listagem de produtos
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).send('Erro ao carregar produtos'); // Retorna erro caso algo falhe
  }
};

// Exibe o formulário para editar um produto existente
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID do produto a ser editado
    const product = await Product.findByPk(id, {
      include: [{ model: Diseases, as: 'doencas' }] // Inclui as doenças associadas ao produto
    });
    const doencas = await Diseases.findAll(); // Obtém todas as doenças disponíveis
    res.render('editar-produto', { product, doencas }); // Renderiza o formulário de edição
  } catch (err) {
    console.error('Erro ao carregar produto:', err);
    res.status(500).send('Erro ao carregar produto'); // Retorna erro caso algo falhe
  }
};

// Atualiza as informações de um produto existente
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID do produto a ser atualizado
    const { name, description, price, category, doencas } = req.body; // Dados enviados pelo formulário

    // Objeto com os dados que serão atualizados no produto
    const updatedData = {
      name,
      description,
      price,
      category,
      image: req.file ? req.file.filename : undefined, // Atualiza a imagem apenas se um arquivo foi enviado
    };

    // Atualizando o produto no banco de dados
    await Product.update(updatedData, { where: { id } });

    // Se doenças foram selecionadas, atualiza a relação entre produto e doenças
    if (doencas) {
      // Remove as doenças antigas associadas ao produto
      await ProductDisease.destroy({ where: { ProductId: id } });

      // Associa as novas doenças ao produto
      for (const diseaseId of doencas) {
        await ProductDisease.create({ ProductId: id, DiseaseId: diseaseId });
      }
    }

    // Redireciona para a página de listagem de produtos após a atualização
    res.redirect('/produtos');
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).send('Erro ao atualizar produto'); // Retorna erro caso algo falhe
  }
};

// Exclui um produto do banco de dados
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID do produto a ser excluído
    await Product.destroy({ where: { id } }); // Remove o produto do banco de dados
    res.redirect('/produtos'); // Redireciona para a página de listagem de produtos
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).send('Erro ao excluir produto'); // Retorna erro caso algo falhe
  }
};
