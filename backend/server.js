require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TODO';

// Updated CORS Configuration for development
const corsOptions = {
  origin: '*', // Allow all origins d

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add a middleware to handle OPTIONS requests for preflight
app.options('*', cors(corsOptions));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running' });
});

// Create todo
app.post('/add', async (req, res) => {
  try {
    const { task, description, priority, category, dueDate } = req.body;
    if (!task || task.trim() === '') {
      return res.status(400).json({ error: 'Task is required' });
    }

    const newTodo = await TodoModel.create({
      task,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all todos
app.get('/get', async (req, res) => {
  try {
    const todos = await TodoModel.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle todo status (done/not done)
app.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.done = !todo.done;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error updating todo status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update todo
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task, description, priority, category, dueDate, done } = req.body;

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      {
        task,
        description,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        done
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete todo
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get todos by category
app.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const todos = await TodoModel.find({ category }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
