// Importando o módulo 'multer' para manipulação de uploads de arquivos e o módulo 'path' para trabalhar com caminhos de arquivos
const multer = require('multer');
const path = require('path');

// Definindo a configuração de armazenamento para o 'multer'
// O 'multer.diskStorage' permite que você defina onde os arquivos serão armazenados e como serão nomeados
const storage = multer.diskStorage({
  // Função para definir o destino do upload. No caso, os arquivos serão salvos na pasta 'public/uploads/'
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  
  // Função para definir o nome do arquivo ao ser armazenado
  // O 'Date.now()' gera um nome único baseado no timestamp atual
  // 'path.extname(file.originalname)' retorna a extensão do arquivo (ex: .jpg, .png) para manter a extensão original
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Criando a configuração de upload utilizando a configuração de 'storage' definida acima
const upload = multer({ storage: storage });

// Exportando o middleware 'upload' para ser usado em outras partes da aplicação
module.exports = upload;
