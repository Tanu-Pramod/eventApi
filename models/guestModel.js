const mongoose = require('mongoose');
const Schema = mongoose.Schema
const guestSchema = mongoose.Schema({
  guest_name: String,
  contact: String,
  email: {
    unique: true,
    type: String,
    trim: true,
    lowercase: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  image : String,
  
});


var guestModel = mongoose.model("guest", guestSchema );


module.exports = guestModel;




