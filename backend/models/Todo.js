const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  done: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'general'
  },
  dueDate: {
    type: Date,
    default: null
  }
},
  {
    timestamps: true,
  });

const TodoModel = mongoose.model('tasks', todoSchema);

module.exports = TodoModel;
