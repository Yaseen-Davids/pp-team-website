var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var request = require('request');
var passport = require('passport');
var back = require('express-back');
var fs = require("fs");
var sgMail = require('@sendgrid/mail');
var bcrypt = require('bcryptjs');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

// User model
var User = require('../models/user');
// Notes model
var Notes = require('../models/notes');
// Calendar Model
var Calendar = require('../models/calendar');
// Merchant Modal
var Merchant = require('../models/merchant');

// Express session Middleware
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));


// Express Messages Middleware
router.use(require('connect-flash')());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
router.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

router.use(back());


// Passport Config
require('../config/passport')(passport);
// Passport Middleware
router.use(passport.initialize());
router.use(passport.session());


// Set global variable for all pages
router.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// ********************************** ROUTING **********************************

// ************** GET home page **************
router.get('/', ensureAuthenticated, function(req, res, next) {

  var newToken = res.locals.user.token,
  theToken = newToken.split("="),
  userToken = theToken[0];

  res.cookie(userToken, ";expires=Tue, 18 Feb 2025 00:00:00 UTC");

  let errors = req.validationErrors();

  Notes.find({}, function(err, notes){
    Merchant.find({}, function(merch_err, merchants){
      if (err) {
        console.log(err);
      }
      else if (merch_err){
        console.log(merch_err);
      }
      else {
        res.render('index', {
          notes: notes,
          merchants: merchants,
          errors: errors
        })
      }
    }).sort(
      { "name": 1 }
    )
  }).sort(
    { "_id":-1 }
  )
});


// ************** ADD NOTE CHECK **************
router.get('/completed/:id', ensureAuthenticated, function(req, res, next){

  var note = {};
  note.completed = 'true';

  let query = {_id:req.params.id};

  Notes.update(query, note , function(err){
    if (err) {
      console.log(err)
    }
    else{
      return;
    }
  })
});

// ************** REMOVE  NOTE CHECK **************
router.get('/redo-note/:id', ensureAuthenticated, function(req, res, next){

  var note = {};
  note.completed = 'false';
  let query = {_id:req.params.id};

  Notes.update(query, note , function(err){
    if (err) {
      console.log(err)
    }
    else{
      return;
    }
  })
});

// ************** DELETE NOTE **************
router.delete('/delete-note/id=:id', ensureAuthenticated, function(req, res, next){

  let query = {_id:req.params.id};

  Notes.findById(req.params.id, function(err, note){
    if (err) {
      console.log(err);
    }
    else{
      Notes.remove(query, function(err){
        if (err){
          console.log(err);
        }
      })
    }
  });
})

// ************** POST NEW NOTE **************
router.post('/add_new_note', ensureAuthenticated, function(req, res, next){

  var note = new Notes();

  note.username = req.body.username;
  note.note = req.body.note;
  note.importance = req.body.importance;
  note.completed = req.body.completed;

  note.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      req.flash('success', 'New Task Added');
      res.redirect('/');
    }
  })
});

router.get("/notes_data/:id", ensureAuthenticated, function(req, res, next){

  Notes.findById(req.params.id, function(err, note){
    if (err){
      return err;
    }
    else{
      res.send(note)
    }
  })

})

// EDIT NOTE
router.post('/edit_note', ensureAuthenticated, function(req, res, next){

  var note = {};

  note.username = req.body.username;
  note.note = req.body.note;
  note.importance = req.body.importance;
  note.completed = req.body.completed;
  var theID = req.body.id;

  let query = {_id:theID};

  Notes.update(query, note , function(err){
    if (err) {
      console.log(err)
    }
    else{
      req.flash("success", "Task has been updated")
      res.redirect("/");
    }
  })
});

// ************** GET Calender PAGE **************
router.get('/calendar', ensureAuthenticated, function(req, res, next){

  let errors = req.validationErrors();

  Calendar.find({}, function(err, dates){
    if (err) {
      console.log(err);
    }
    else {
      res.render('calendar', {
        dates: dates,
        errors: errors,
        header: "Calendar",
      })
    }
  })
});

// ************** GET CALENDAR DATA **************
router.get("/calendar-data", ensureAuthenticated, function(req, res, next){

  Calendar.find({}, function(err, dates){
    if (err){
      return err;
    }
    else{
      res.send(dates);
    }
  })

});

router.post("/calendar-date-update/:id", ensureAuthenticated, function(req, res, next){

  var date = {};

  date.title = req.body.title;
  date.start = req.body.start;
  date.end = req.body.end;
  date.color = req.body.color;

  var dateID = req.params.id;
  let query = {_id: dateID};

  Calendar.update(query, date , function(err){
    if (err) {
      console.log(err)
    }
    else{
      res.send("Success");
    }
  })

})

// ************** POST CALENDAR DATE **************
router.post('/calendar-form', ensureAuthenticated, function(req, res, next){

  var date = new Calendar();

  date.title = req.body.username + " - " + req.body.title;
  date.start = req.body.startDate;
  date.end = req.body.endDate;
  date.color = req.body.color;

  date.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      req.flash('success', 'New Calendar Date Added');
      res.redirect('/calendar');
    }
  })
})

// ************** REMOVE  NOTE CHECK **************
router.post('/calendar-edit', ensureAuthenticated, function(req, res, next){

  var date = {};

  date.title = req.body.edit_fullname + " - " + req.body.edit_leave;
  date.start = req.body.edit_startdate;
  date.end = req.body.edit_enddate;
  date.color = req.body.edit_color;

  var dateID = req.body.edit_id;
  let query = {_id: dateID};

  Calendar.update(query, date , function(err){
    if (err) {
      console.log(err)
    }
    else{
      req.flash("success", "Calendar date updated");
      res.redirect("/calendar");
    }
  })

});

// ************** REMOVE CALENDAR DATE **************
router.post("/delete-calendar-date/:id", ensureAuthenticated, function(req, res, next){

  let query = {id: req.params.id}

  Calendar.findById(req.params.id, function(err, date){
    if (err){
      console.log(err)
    }
    else{
      date.remove(query, function(err){
        if (err){
          console.log(err)
        }
        else{
          req.flash("success", "Calendar date removed");
          res.redirect("/calendar");
        }
      })
    }
  })

})

// ************** GET CALENDAR DATE **************
router.get('/get-calendar-date/:id', ensureAuthenticated, function(req, res, next){

  Calendar.findById(req.params.id, function(err, date){
    if (err){
      return err;
    }
    else{
      res.send(date);
    }
  })

})

// ************** GET Hr Policy PAGE **************
router.get('/hr-policy', ensureAuthenticated, function(req, res, next){

  res.render('hr_policy', {
    header: "HR Policy"
  });
});

router.get('/feedback', ensureAuthenticated, function(req,res,rext){

  res.render('feedback', {
    header: "Feedback"
  });
  
})

router.get("/admin", ensureAuthenticated, function(req, res, next){

  let errors = req.validationErrors();

  if (res.locals.user.admin == "false"){
    req.flash("danger", "You do not have access to this.");
    res.redirect("/");
  }
  else{
    User.find({}, function(user_err, users){
      Notes.find({}, function(notes_err, notes){
        Merchant.find({}, function(merchant_err, merchants){
          if (user_err || notes_err || merchant_err){
            return;
          }
          else{
            res.render("admin", {
              header: "Admin",
              allUsers: users,
              notes: notes,
              merchants: merchants,
              errors: errors
            })
          }
        })
      }).sort(
        {"name": 1}
      )
    }).sort(
      { "_id":-1 }
    )
  }
})

// ************** DELETE USER **************
router.delete("/delete-user/:id",ensureAuthenticated, function(req, res, next){

  let query = {id: req.params.id}

  User.findById(req.params.id, function(err, user){
    if (err) {
      console.log(err);
      return;
    }
    else{
      user.remove(query, function(err){
        if (err){
          console.log(err);
          return;
        }
        else{
          console.log("User account removed");
        }
      })
    }
  });
})

// ************** MERCHANTS SECTION **************
// NEW MERCHANT
router.post("/new_merchant", ensureAuthenticated, function(req, res, next){

  var merchant = new Merchant();
  merchant.username = req.body.username;
  merchant.name = req.body.name;
  merchant.sandbox = req.body.sandbox;
  merchant.documents = req.body.documents;
  merchant.contract = req.body.contract;
  merchant.update = req.body.update;

  merchant.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      req.flash('success', 'New Merchant Added');
      res.redirect('/');
    }
  })
});

// EDIT MERCHANT
router.post("/edit_merchant", ensureAuthenticated, function(req, res, next){

  var merchant = {};
  merchant.username = req.body.username;
  merchant.name = req.body.name;
  merchant.sandbox = req.body.sandbox;
  merchant.documents = req.body.documents;
  merchant.contract = req.body.contract;
  merchant.update = req.body.update;
  
  var query = {_id: req.body.id};

  Merchant.update(query, merchant, function(err){
    if (err){
      console.log(err);
    }
    else{
      req.flash("success", "Merchant updated");
      res.redirect("/");
    }
  })

});

router.get("/get_merchant/:id", ensureAuthenticated, function(req, res, next){

  var query = req.params.id;

  Merchant.findById(query, function(err, merchant){
    if (err){
      console.log(err);
    }
    else{
      res.send(merchant);
    }
  })

})

// ************** DELETE NOTE **************
router.delete('/delete-merchant/:id', ensureAuthenticated, function(req, res, next){

  let query = {_id:req.params.id};

  Merchant.findById(req.params.id, function(err, note){
    if (err) {
      console.log(err);
      return;
    }
    else{
      Merchant.remove(query, function(err){
        if (err){
          console.log(err);
          return;
        }
      })
    }
  });
})

router.post("/user-admin", ensureAuthenticated, function(req, res, next){

  var id = req.body.id;
  var query = {_id: id}

  var user = {};
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.token = req.body.token;
  user.admin = "true";
  
  User.update(query, user, function(error){
    if (error){
      console.log(error)
    }
    else{
      req.flash("success", "Merchant account updated");
      res.redirect('/admin');
    }
  })

})

router.post("/remove-admin", ensureAuthenticated, function(req, res, next){

  var id = req.body.id;
  var query = {_id: id}

  var user = {};
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.token = req.body.token;
  user.admin = "false";
  
  User.update(query, user, function(error){
    if (error){
      console.log(error)
    }
    else{
      req.flash("success", "Merchant account updated");
      res.redirect('/admin');
    }
  })

})

router.get("/get-user/:id", ensureAuthenticated, function(req, res, next){

  User.findById(req.params.id, function(err, user){
    if (err){
      console.log(err);
    }
    else{
      res.send(user);
    }
  })

})


router.get("/send-new-password/:id/:email", ensureAuthenticated, function(req, res, next){

  var id = req.params.id;
  var email = req.params.email;

  sgMail.setApiKey("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")
  const msg = {
    to: email,
    from: 'yaseendavids477@gmail.com',
    subject: 'New Password Request - Peach Website',
    html: "Go to the following link to reset your password: <br><a href='https://peach-website.herokuapp.com/new-password/" + id + "'>Reset my password</a>",
  };
  sgMail.send(msg);

  console.log("Email sent");

});

router.get("/new-password/:id", function(req, res, next){

  var query = {_id: req.params.id};
  let errors = req.validationErrors();

  User.findById(query, function(err, user){
    if (err){
      console.log(err)
    }
    else{
      res.render("new-password", {
        header: "New Password",
        user: user,
        errors: errors
      })
    }

  })

});

router.post("/update-password", function(req, res, next){

  var userPassword = req.body.password;
  var confirmPassword = req.body.password2;

  if (userPassword === confirmPassword){

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(userPassword, salt, function(err, hash){
        
        userPassword = hash;
  
        var user = {};
        user.username = req.body.username;
        user.email = req.body.email;
        user.token = req.body.token;
        user.admin = req.body.admin;
        user.password = userPassword;

        var errors = req.validationErrors();
        var query = {_id: req.body.id};

        if (errors){
          console.log(errors)
        }
        else{
          User.update(query, user, function(error){
            if (error){
              console.log(error)
            }
            else{
              req.flash("success", "Password Updated");
              res.redirect('/users/login');
            }
          })
        }
      })
    })

  }
  else{
    req.flash("danger", "Passwords do not match");
    res.redirect('back');
  }

});

router.get('/leave', ensureAuthenticated, function(req, res, next){

  res.render("leave", {
    header: "Leave"
  });

});

router.get('/profile', ensureAuthenticated, function(req, res, next){

  res.render("profile", {
    header: "Profile"
  });

});

// ************** Access control **************
function ensureAuthenticated(req, res, next){

  let errors = req.validationErrors();

  var newToken = req.headers.cookie;

  if (newToken === null || newToken === "" || newToken == null){
    console.log("No token");
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }

  if (req.isAuthenticated()){
    console.log("User Logged in already");
    return next();
  }

  else{

    var theToken = newToken.split("=");
    var userToken = theToken[0];

    User.findOne({token: userToken}, (err, users) => {
      if (err){
        console.log("Users don't have token");
        console.log(err);
        res.redirect('/users/login');
      }
      else{
        if (users === null || users === ""){
          console.log(users);
          res.redirect('/users/login');
        }
        else{
          if (users.token == userToken){
            console.log("User token equals to cookie");
            res.render('tokenlogin', {
              header: "Logging In",
              username: users.username,
              password: users.password,
              token: userToken
            });
          }
          else{
            console.log("Token not found");
            res.redirect('/users/login');
          }
        }
      }
    })
  }
}

module.exports = router;