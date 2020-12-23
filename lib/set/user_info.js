module.exports.setUserInfo = function(username, password, salt, displayName, email) {
  var user = {
    authId: 'local:'+ username,
    username: username,
    password: password,
    salt: salt,
    displayName: displayName,
    email: email
  };
  return user;
};
