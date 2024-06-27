import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './TodoList';
import Login from './Login';

const RoutesComponent = ({ isLoggedIn, setIsLoggedIn, username, handleLogin, setTodos }) => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setTodos={setTodos} />} />
      {isLoggedIn ? (
        <Route path="/todos" element={<TodoList username={username} />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default RoutesComponent;
