const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT =  5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for users and their todos
const users = {};

// Route to handle user login/registration
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!users[username]) {
    // If user doesn't exist, create a new user
    users[username] = { password, todos: [] };
    return res.json({ message: 'User registered successfully', todos: [] });
  }

  if (users[username].password === password) {
    // If user exists and password matches, return the user's todos
    return res.json({ message: 'Login successful', todos: users[username].todos });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// Route to handle fetching todos for a user
app.get('/todos', (req, res) => {
  const { username } = req.query;

  if (!users[username]) {
    return res.status(404).json({ message: 'User not found aaaaaaaaaaaaaah' });
  }

  return res.json(users[username].todos);
});

// Route to handle adding a new todo
app.post('/todos', (req, res) => {
  const { username, todo } = req.body;

  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[username].todos.push(todo);
  return res.json(users[username].todos);
});

// Route to handle deleting a todo
app.delete('/todos/:id', (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[username].todos = users[username].todos.filter(todo => todo.id !== parseInt(id, 10));
  return res.json(users[username].todos);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
