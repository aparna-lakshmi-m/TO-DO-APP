const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
