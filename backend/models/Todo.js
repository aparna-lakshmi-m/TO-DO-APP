const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  todoContent: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date }
});

module.exports = mongoose.model('Todo', TodoSchema);
