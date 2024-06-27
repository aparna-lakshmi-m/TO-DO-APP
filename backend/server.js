const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Todo = require('./models/Todo');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const MONGO_URL = "mongodb://0.0.0.0:27017/todoapp";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Database connection error:", error));

// Route to handle user login/registration
app.post('/login', async (req, res) => {
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


// Route to handle fetching todos for a user
app.get('/todos', async (req, res) => {
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

// Route to handle adding a new todo
app.post('/todos', async (req, res) => {
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

// Route to handle deleting a todo
app.delete('/todos/:id', async (req, res) => {
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

// Route to handle updating a todo
app.put('/todos/:id', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
