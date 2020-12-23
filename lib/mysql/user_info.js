module.exports.regist = function(conn, userInfo) {
  var sql = 'INSERT INTO users SET ?';
  conn.query(sql, userInfo, function(err, results) {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      req.login(userInfo, function(err) {
        req.session.save(function() {
          res.redirect('/welcome');
        });
      });
    }
  });
};

module.exports.find = function(conn, userId, passwd) {
  var sql = 'SELECT * FROM users WHERE username = ?, password = ?';
  conn.query(sql, [userId, passwd], function(err, results) {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      req.login(userInfo, function(err) {
        req.session.save(function() {
          res.redirect('/welcome');
        });
      });
    }
  });
};
