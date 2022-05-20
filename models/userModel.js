const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  email: String,
  password: String
});

var usersModel = mongoose.model("users", userSchema);

module.exports = usersModel;