const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.home);
router.get('/login', authController.login);
router.get('/registro', authController.registro);
router.get('/inicial', authController.inicial);
router.get('/catalogo', authController.catalogo);
router.get('/perfil', authController.perfil);
router.post('/inicial', authController.loginPost);
router.post('/registro', authController.registroPost);
router.get('/logout', authController.logout);
router.get('/home', authController.home);

module.exports = router;
