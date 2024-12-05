// Routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const multerConfig = require('../Config/multerConfig');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
  
  const upload = multer({ storage: storage });

router.get('/', authController.home);
router.get('/inicial', authController.inicial);
router.get('/catalogo', authController.catalogo);
router.post('/inicial', authController.loginPost);
router.post('/registro', authController.registroPost);
router.get('/home', authController.home);


//Carrinho
router.get('/carrinho', authController.exibirCarrinho);
router.post('/adicionar-ao-carrinho', authController.adicionarAoCarrinho);
router.post('/remover-do-carrinho', authController.removerDoCarrinho);
router.get('/checkout', authController.checkout);
router.post('/atualizar-quantidade', authController.atualizarQuantidade);
router.post('/finalizar-compra', authController.finalizarCompra);


//Usuario
router.get('/login', authController.login);
router.get('/registro', authController.registro);
router.get('/logout', authController.logout);
router.get('/perfil', authController.perfil);
router.get('/usuarios', authController.listUsers);
router.get('/usuarios/:id/edit', authController.editUser);
router.post('/usuarios/:id/update', authController.updateUser);
router.post('/usuarios/:id/delete', authController.deleteUser);

//Produto
router.get('/criar-produto', productController.exibirFormularioProduto);
router.post('/criar-produto', multerConfig.single('imagem'), productController.inserirProduto);
router.get('/produtos', productController.listProducts);
router.get('/produtos/:id/edit', productController.editProduct);
router.post('/produtos/:id/update', productController.updateProduct);
router.post('/produtos/:id/delete', productController.deleteProduct);
router.get('/catalogo', authController.catalogo);

module.exports = router;
