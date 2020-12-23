module.exports.err_print = function(res, err, code) {
  console.log(err);
  res.status(code);
};
