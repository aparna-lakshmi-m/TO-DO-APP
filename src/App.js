import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './Routes/RoutesComponent';
import './App.css';
const AppContext = createContext()
const App = () => {
  const test = "tesxt value"
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
      <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, handleLogin, handleLogout, todos, setTodos }}> 
    <Router>

      {isLoggedIn && (
        <nav className="navbar">
          <ul className="nav-links">
            {/* Add your navbar items here if needed */}
          </ul>
          <div className="bottom-content">
            <span className="username">{username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>  
          </div>
        </nav>
      )}
      <RoutesComponent
        
      />
              
    </Router>
    </AppContext.Provider>
  );
};

export default App;

export {AppContext}