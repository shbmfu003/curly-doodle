const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User Model
const User = require('../models/User')

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword
  } = req.body;

  let errors = [];

  // Check Required Fields
  if (!name) {
    errors.push({
      msg: 'Please fill in the full name'
    });
  }
  if (!email) {
    errors.push({
      msg: 'Please fill in the email'
    });
  }
  if (!password) {
    errors.push({
      msg: 'Please fill in password'
    });
  } else if (!confirmPassword) {
    errors.push({
      msg: 'Please confirm Password'
    });
  } else {
    // Matching Passwords Check
    if (password !== confirmPassword) {
      errors.push({
        msg: 'Passwords do not match'
      });
    }
    // Password Length Check
    if (password.length < 6) {
      errors.push({
        msg: 'Password should be atleast 6 characters'
      });
    }
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    });
  } else {
    // Validation Passed
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          // User Exists
          errors.push({
            msg: 'Email Already Exists'
          });
          res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              // Set Password to Hashed
              newUser.password = hash;
              // Save User
              newUser.save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Dashboard Page
router.get('/dashboard', (req, res) => res.render('dashboard'));

module.exports = router;
