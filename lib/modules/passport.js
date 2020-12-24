/*jshint esversion: 6 */

module.exports = function(app,session){
  var MySQLStore = require('express-mysql-session')(session);
  var mysql_conn_info = require('../mysql/mysql_conn');
  var mysql_options = mysql_conn_info.info();
  var sessionStore = new MySQLStore(mysql_options);
  var conn = mysql_conn_info.connect();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();

  app.use(session({
    secret: 'secetKeyString',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    return done(null, user.authId);
  });
  passport.deserializeUser(function(authId, done) {
    console.log('deserializeUser', authId);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [authId], function(err, results) {
      if (err) {
        console.log(err);
        return done('There is no user.');
      } else {
        return done(null, results[0]);
      }
    });
  });
  passport.use(new LocalStrategy(
    function(username, password, done) {
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:' + uname], function(err, results) {
        if (err) {
          return done(err);
        } else if (!results.length) {
          // return done('해당하는 ID가 존재하지 않습니다.');
          done(null, false);
        } else {
          var user = results[0];
          return hasher({
            password: pwd,
            salt: user.salt
          }, function(err, pass, salt, hash) {
            if (hash === user.password) {
              console.log('LocalStrategy', user);
              done(null, user);
            } else {
              // return done('ID/PWD가 정확하지 않습니다.');
              done(null, false);
            }
          });
        }
      });
    }
  ));

  return passport;
};
