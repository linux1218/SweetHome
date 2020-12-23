/*jshint esversion: 6 */
var mysql_options = {
  host: 'localhost',
  port: 3306,
  user: 'nodejs',
  password: '111111',
  database: 'o2'
};

module.exports.info = function(){
  return mysql_options;
};

module.exports.connect = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection(mysql_options);
  conn.connect();
  return conn;
};
