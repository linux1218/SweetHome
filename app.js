/*jshint esversion: 6 */
var mysql_options = {
  host: 'localhost',
  port: 3306,
  user: 'nodejs',
  password: '111111',
  database: 'o2'
};
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var handel_user = require('./lib/set/user_info');
var mysql_conn_info = require('./lib/mysql/mysql_conn');
var mysql_user_handle = require('./lib/mysql/user_info');
var errHandle = require('./lib/error/error');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var hasher = bkfd2Password();
var mysql_options = mysql_conn_info.info();
var conn = mysql_conn_info.connect();
var sessionStore = new MySQLStore(mysql_options);

var app = express();
var port = 3003;

app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', './views');

app.use(session({
  secret: 'secetKeyString',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, saveAuthId) {
  console.log('serializeUser', user);
  saveAuthId(null, user.authId);
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

app.locals.pretty = true;

app.get('/', (req, res) => {
  res.redirect('/welcome');
});
app.get('/welcome', (req, res) => {
  if(req.user && req.user.displayName) {
    res.render('welcome/welcome', {
      displayName: req.user.displayName
    });
  }else{
    res.render('welcome/welcome');
  }
});
app.get('/user/login', (req, res) => {
  res.render('welcome/login');
});
app.get('/user/regist', (req, res) => {
  res.render('user/regist');
});

app.post('/user/login',
  passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/user/login',
    failureFlash: false
  })
);

app.get('/user/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.post('/user/regist', (req, res) => {
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
                  res.redirect('/welcome');
                });
              });
            }
          });
        }
      }
    });
  });
});


app.listen(port, () => {
  console.log(`START SWEET HOME PROJECT http://localhost:${port}`);
});
