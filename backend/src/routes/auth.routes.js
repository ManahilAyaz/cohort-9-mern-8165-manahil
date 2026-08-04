const express = require('express');
const { signup, login, logout } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);

module.exports = router;
