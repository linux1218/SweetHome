/*jshint esversion: 6 */

module.exports = function() {
  var express = require('express');
  var bodyParser = require('body-parser');
  var app = express();

  app.set('trust proxy', 1);
  app.set('views', './views');

  app.set('view engine', 'pug');
  app.use(express.static('public'));

  // app.set('view engine', 'ejs');
  // app.engine('html', require('ejs').renderFile);

  app.use(bodyParser.urlencoded({
    extended: false
  }));

  return app;
};
