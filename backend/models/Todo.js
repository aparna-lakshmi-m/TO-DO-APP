const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  todoContent: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: function() { return this.isNew; } }, // Validate on creation only
  category: { type: String, required: function() { return this.isNew; } },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date }
});

module.exports = mongoose.model('Todo', TodoSchema);
