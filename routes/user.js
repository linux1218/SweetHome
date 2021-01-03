/*jshint esversion: 6 */

module.exports = function(passport) {
  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var handel_user = require('../lib/set/user_info');
  var mysql_conn_info = require('../lib/mysql/mysql_conn');
  var mysql_user_handle = require('../lib/mysql/user_info');
  var mysql_options = mysql_conn_info.info();
  var conn = mysql_conn_info.connect();
  var errHandle = require('../lib/error/error');

  route.get('/welcome', (req, res) => {
    if (req.user && req.user.displayName) {
      res.render('user/welcome', {
        displayName: req.user.displayName
      });
    } else {
      res.render('user/welcome');
    }
  });

  route.get('/sample/button', function(req, res) {
    res.render('user/sample/sample_button');
  });

  route.get('/sample/test', function(req, res) {
    res.render('user/sample/test');
  });

  route.get('/sample', function(req, res) {
    res.render('user/sample/menu');
  });

  route.get('/login', function(req, res) {
    res.render('user/login');
  });

  route.get('/regist', function(req, res) {
    res.render('user/regist');
  });

  route.post('/login',
    passport.authenticate('local', {
      successRedirect: 'welcome',
      failureRedirect: 'login',
      failureFlash: false
    })
  );

  route.get('/logout', function(req, res) {
    req.logout();
    req.session.save(function() {
      res.redirect('welcome');
    });
  });

  route.post('/regist', function(req, res) {
    hasher({
      password: req.body.password
    }, function(err, pass, salt, hash) {
      var uname = req.body.username;
      var displayName = req.body.displayName;
      var email = req.body.email;
      // var sql = 'SELECT username, displayName FROM users WHERE username = ?';
      var sql = 'SELECT username, displayName FROM users WHERE authId = ?';
      conn.query(sql, ['local:' + uname], function(err, results) {
        if (err) {
          errHandle.err_print(res, err, 500);
        } else {
          if (results.length) {
            res.render('user/duplicate_user');
          } else {
            var userInfo = handel_user.setUserInfo(uname, hash, salt, displayName, email);
            var sql = 'INSERT INTO users SET ?';
            conn.query(sql, userInfo, function(err, results) {
              if (err) {
                errHandle.err_print(res, err, 500);
              } else {
                req.login(userInfo, function(err) {
                  req.session.save(function() {
                    res.redirect('welcome');
                  });
                });
              }
            });
          }
        }
      });
    });
  });
  return route;
};
