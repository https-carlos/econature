// Importação das dependências necessárias
const express = require('express'); // Framework para criação de servidores HTTP
const router = express.Router(); // Criação de um roteador para gerenciar as rotas da aplicação
const authController = require('../controllers/authController'); // Controlador para gerenciar autenticação de usuários
const productController = require('../controllers/productController'); // Controlador para gerenciar produtos
const multerConfig = require('../Config/multerConfig'); // Configuração do multer (usado para upload de arquivos)
const multer = require('multer'); // Middleware para upload de arquivos
const path = require('path'); // Módulo para manipulação de caminhos de arquivos

// Configuração do armazenamento de arquivos (com o multer)
const storage = multer.diskStorage({
    // Função para definir onde os arquivos serão armazenados
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/'); // Os arquivos serão salvos na pasta 'public/uploads/'
    },
    // Função para definir o nome do arquivo
    filename: function (req, file, cb) {
      // O nome do arquivo será a data atual (em milissegundos) seguida pela extensão original do arquivo
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
  
// Instância do multer com a configuração acima, para permitir o upload de arquivos
const upload = multer({ storage: storage });

// Rotas relacionadas à autenticação e páginas gerais
router.get('/', authController.home); // Rota para a página inicial
router.get('/inicial', authController.inicial); // Rota para a página inicial (ou outra página de introdução)
router.get('/catalogo', authController.catalogo); // Rota para exibir o catálogo de produtos
router.post('/inicial', authController.loginPost); // Rota para realizar o login (requisição POST)
router.post('/registro', authController.registroPost); // Rota para registrar um novo usuário (requisição POST)
router.get('/home', authController.home); // Outra rota para a página inicial (duplicada)

// Rotas do carrinho de compras
router.get('/carrinho', authController.exibirCarrinho); // Exibe o conteúdo do carrinho
router.post('/adicionar-ao-carrinho', authController.adicionarAoCarrinho); // Adiciona um item ao carrinho (requisição POST)
router.post('/remover-do-carrinho', authController.removerDoCarrinho); // Remove um item do carrinho (requisição POST)
router.get('/checkout', authController.checkout); // Exibe a página de checkout para finalizar a compra
router.post('/atualizar-quantidade', authController.atualizarQuantidade); // Atualiza a quantidade de um item no carrinho
router.post('/finalizar-compra', authController.finalizarCompra); // Finaliza a compra do usuário

// Rotas de gerenciamento de usuários
router.get('/login', authController.login); // Exibe a página de login
router.get('/registro', authController.registro); // Exibe a página de registro
router.get('/logout', authController.logout); // Realiza o logout do usuário
router.get('/perfil', authController.perfil); // Exibe o perfil do usuário
router.get('/usuarios', authController.listUsers); // Exibe a lista de usuários cadastrados
router.get('/usuarios/:id/edit', authController.editUser); // Exibe a página para editar um usuário específico
router.post('/usuarios/:id/update', authController.updateUser); // Atualiza as informações de um usuário específico
router.post('/usuarios/:id/delete', authController.deleteUser); // Exclui um usuário específico

// Rotas relacionadas aos produtos
router.get('/criar-produto', productController.exibirFormularioProduto); // Exibe o formulário para criação de um novo produto
router.post('/criar-produto', multerConfig.single('imagem'), productController.inserirProduto); // Cria um novo produto, com upload de imagem
router.get('/produtos', productController.listProducts); // Exibe a lista de todos os produtos cadastrados
router.get('/produtos/:id/edit', productController.editProduct); // Exibe a página para editar um produto específico
router.post('/produtos/:id/update', productController.updateProduct); // Atualiza as informações de um produto específico
router.post('/produtos/:id/delete', productController.deleteProduct); // Exclui um produto específico
router.get('/catalogo', authController.catalogo); // Exibe o catálogo de produtos (duplicada com a anterior)

// Exporta as rotas para que possam ser usadas em outras partes do código (geralmente no app principal)
module.exports = router;
