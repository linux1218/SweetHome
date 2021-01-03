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
  var multer = require('multer');
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/images');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage });

  route.get('/wanted', function(req, res) {
    res.render('travel/show_list', {
      title: '다녀온 장소'
    });
  });

  route.get('/want', function(req, res) {
    res.render('travel/show_list', {
      title: '가고싶은 장소'
    });
  });

  route.get('/regist', function(req, res) {
    res.render('travel/regist_travel', {
      title: '다녀온 장소'
    });
  });

  route.post('/regist', upload.single('img_name_0'), function(req, res) {
    console.log(req.file);
    var img_file = `${req.file.destination}${req.file.originalname}`;
    var desc_text = req.body.desc_text_0;
    res.send(img_file+ '   ' + desc_text );
  });

  return route;
};
