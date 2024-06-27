import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import TodoList from './Routes/TodoList';
import Login from './Routes/Login';
import RoutesComponent from './Routes/RoutesComponent';

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [todos, setTodos] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setTodos([]);
  };

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

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

      <RoutesComponent
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn} // Pass setIsLoggedIn as a prop
          username={username}
          handleLogin={handleLogin}
          setTodos={setTodos}
        />
    </Router>
  );
};




export default App;
