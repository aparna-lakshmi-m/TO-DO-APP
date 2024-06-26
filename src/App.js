import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './components/Login';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [todos, setTodos] = useState([]);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setTodos([]);
  };

  return (
    <Router>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/todos" className="nav-link">Todos</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setTodos={setTodos} />} />
        {isLoggedIn ? (
          <Route path="/todos" element={<TodoList username={username} />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Todo App</h1>
      <div className="content">
        <p className="welcome-message">Manage all your tasks with ease!</p>
        <blockquote className="quote">
          "The secret of getting ahead is getting started." - Mark Twain
        </blockquote>
        <p className="motivation">Yayy! Start organizing your tasks today.</p>
      </div>
    </div>
  );
};

export default App;
