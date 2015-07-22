var mongoose = require ('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password:String
});

userSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({email: email}, function (err, user) {
    console.log(user);
    if (user === null) {
      throw new Error('Can\'t find user with email ' + email);
    } else if (user.checkPassword(password)) {
      callback(null, user);
    }
  });
};

userSchema.methods.checkPassword = function (password) {
  return password == this.password;
};

var user = mongoose.model('user',userSchema);
module.exports = user;