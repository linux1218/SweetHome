/*jshint esversion: 6 */

module.exports = function() {
  var express = require('express');
  var bodyParser = require('body-parser');
  var app = express();

  app.set('trust proxy', 1);
  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use(bodyParser.urlencoded({
    extended: false
  }));

  return app;
};
