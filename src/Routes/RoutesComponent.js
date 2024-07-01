import React ,{useContext} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './TodoList';
import Login from './Login';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import { AppContext } from '../App';

const RoutesComponent = () => {
  const { isLoggedIn, setIsLoggedIn, username, handleLogin, handleLogout, todos, setTodos } = useContext(AppContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute isLoggedIn={isLoggedIn} redirectTo="/todos">
            <Navigate to="/todos" />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute isLoggedIn={isLoggedIn} redirectTo="/todos">
            <Login onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} setTodos={setTodos} />
          </PublicRoute>
        }
      />
      <Route
        path="/todos"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn} redirectTo="/login">
            <TodoList username={username} />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/todos" : "/login"} />} />
    </Routes>
  );
};

export default RoutesComponent;
