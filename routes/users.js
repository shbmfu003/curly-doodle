const express = require('express');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login'));
// Register Page
router.get('/register', (req, res) => res.render('register'));
// Dashboard Page
router.get('/dashboard', (req, res) => res.render('dashboard'));

module.exports = router;
