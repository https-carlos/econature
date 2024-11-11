const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Diseases = require('../models/Diseases');
const ProductDisease = require('../models/ProductDisease');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


exports.exibirFormularioProduto = async (req, res) => {
  try {

    const doencas = await Diseases.findAll();


    res.render('criar-produto', { doencas });
  } catch (err) {
    console.error('Erro ao carregar o formulário:', err);
    res.status(500).send('Erro ao carregar o formulário');
  }
};



exports.inserirProduto = async (req, res) => {
  try {
    console.log('Arquivo enviado:', req.file);
    console.log('Corpo da requisição:', req.body);

    if (!req.file) {
      return res.status(400).send('A imagem do produto é obrigatória.');
    }


    const doencas = req.body.doencas;
    if (!doencas || doencas.length === 0) {
      return res.status(400).send('Pelo menos uma doença precisa ser selecionada.');
    }


    const produto = await Product.create({
      name: req.body.nome,
      description: req.body.descricao,
      price: req.body.preco,
      category: req.body.categoria,
      image: req.file.filename,
    });


    for (const doencaId of doencas) {
      await ProductDisease.create({
        ProductId: produto.id,
        DiseaseId: doencaId,
      });
    }

    res.redirect('/inicial');
  } catch (err) {
    console.error('Erro ao adicionar o produto:', err);
    res.status(500).send('Erro ao adicionar o produto');
  }
};


exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('produtos', { products });
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).send('Erro ao carregar produtos');
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: Diseases, as: 'doencas' }]  // Alteração aqui, usaremos 'doencas'
    });
    const doencas = await Diseases.findAll();
    res.render('editar-produto', { product, doencas });
  } catch (err) {
    console.error('Erro ao carregar produto:', err);
    res.status(500).send('Erro ao carregar produto');
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, doencas } = req.body;
    const updatedData = {
      name,
      description,
      price,
      category,
      image: req.file ? req.file.filename : undefined,
    };

    await Product.update(updatedData, { where: { id } });

    if (doencas) {
      await ProductDisease.destroy({ where: { ProductId: id } });
      for (const diseaseId of doencas) {
        await ProductDisease.create({ ProductId: id, DiseaseId: diseaseId });
      }
    }

    res.redirect('/produtos');
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).send('Erro ao atualizar produto');
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.redirect('/produtos');
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).send('Erro ao excluir produto');
  }
};
