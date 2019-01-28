var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
const TokenGenerator = require('uuid-token-generator');
var cookieParser = require('cookie-parser');
const logout = require('express-passport-logout');
var session = require('express-session');

// Bring in User Model
let User = require('../models/user');

/* GET register page */
router.get('/register', function(req, res, next){

  let errors = req.validationErrors();

  res.render('register', {
    header: "Register",
    errors: errors
  })
});


// Register Process
router.post('/register', function(req, res, next){

  const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
  
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const token = tokgen.generate();
  const admin = "false";

  res.cookie(token, "expires=Tue, 18 Feb 2025 12:00:00 UTC");

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confPassword', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors){
    console.log(errors);
    res.render('register', {
      header: "Register",
      errors: errors
    })
  }

  else {
    let newUser = new User({
      username: username,
      email: email,
      password: password,
      token: token,
      admin: admin
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
          return;
        }
        newUser.password = hash;

        newUser.save(function(err){
          if (err){
            req.flash('danger', 'Email / Username already in use');
            res.redirect('/users/login');
          }
          else{
            req.flash('success', 'You are now logged in');
            res.render('autologin', {
              header: "Logging In",
              username: username,
              password: password,
              token: token
            });
          }
        });
      });
    })
  }

});


/* GET login page */
router.get('/login', function(req, res, next){

  let errors = req.validationErrors();

  res.render('login', {
    header: "Login",
    errors: errors
  })
});


// Login Process
router.post('/login', function(req, res, next){

  passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

});

router.post('/token/login', (req, res, next) => {

  passport.authenticate('token', {
    successRedirect: '/', 
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

})

// Logout Proccess
router.get('/logout', (req, res) => {

  var token = req.headers.cookie;

  console.log("Logging you out");

  req.logout();
  req.flash('success', 'You are logged out');
  res.clearCookie(token);
  res.redirect('/users/login');

})

module.exports = router;