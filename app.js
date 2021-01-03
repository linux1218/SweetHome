/*jshint esversion: 6 */

var app = require('./lib/modules/express')();
var session = require('express-session');
var passport = require('./lib/modules/passport')(app, session);
var auth = require('./routes/user')(passport);
var travel = require('./routes/travel')(passport);

app.locals.pretty = true;

app.use('/user', auth);
app.use('/travel', travel);

app.get('/', (req, res) => {
  res.redirect('user/welcome');
});

app.listen(3003, () => {
  console.log(`START SWEET HOME PROJECT http://localhost: 3003`);
});
