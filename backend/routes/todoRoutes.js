// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const User = require('../models/User');

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    let user = await User.findOne({ username });

    if (!user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user = new User({ username, password: hashedPassword });
      await user.save();
      return res.json({ message: 'User registered successfully', todos: [] });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const todos = await Todo.find({ userId: user._id });
      return res.json({ message: 'Login successful', todos });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /todos
router.get('/todos', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todos = await Todo.find({ userId: user._id });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /todos
router.post('/todos', async (req, res) => {
  const { username, todoContent } = req.body;

  if (!username || !todoContent) {
    return res.status(400).json({ message: 'Username and todo content are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todo = new Todo({
      userId: user._id,
      todoContent
    });

    await todo.save();
    const todos = await Todo.find({ userId: user._id });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /todos/:id
router.delete('/todos/:id', async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Todo.findByIdAndDelete(id);
    const todos = await Todo.find({ userId: user._id });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /todos/:id
router.put('/todos/:id', async (req, res) => {
  const { username, todoContent } = req.body;
  const { id } = req.params;

  if (!username || !todoContent) {
    return res.status(400).json({ message: 'Username and todo content are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.todoContent = todoContent;
    await todo.save();
    const todos = await Todo.find({ userId: user._id });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
