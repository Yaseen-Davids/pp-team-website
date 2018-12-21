const LocalStrategy = require('passport-local').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');

module.exports = function(passport){

    // Local Strategy
    passport.use('local', new LocalStrategy(function(username, password, done){

        // Match Username
        let query = {
            username:username
        }
        User.findOne(query, function(err, user){
            if (err) throw err;

            if (!user) {
                return done(null, false, {
                    message: "No User Found"
                });
            }

            // Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if (err) throw err;

                if (isMatch) {
                    cookieParser(user.token + "expires=Tue, 18 Feb 2025 23:59:59 GMT");
                    return done(null, user);
                }
                else{
                    return done(null, false, {
                        message: "Incorrect Username or Password"
                    });
                }
            });

        })

    }));

    passport.use('token', new LocalStrategy(function(username, password, done){
        // Match Username
        let query = {
            username:username
        }
        User.findOne(query, function(err, user){
            if (err) throw err;

            if (!user) {
                return done(null, false, {
                    message: "No User Found"
                });
            }
            // Match Password
            if (password == user.password){
                return done(null, user);
            }
            else{
                return done(null, false, {
                    message: "Incorrect Username or Password"
                });
            }

        })
    }));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });

}