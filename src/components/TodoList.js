import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoInput.trim() !== '') {
      const newTodo = {
        id: todos.length + 1, 
        title: todoInput,
        completed: false,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setTodoInput('');
      localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Update local storage
    }
  };

  // Function to handle deletion of a todo
  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Update local storage
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Enter your todo..."
          className="todo-input"
        />
        <button type="submit" className="add-todo-btn">Add Todo</button>
      </form>
      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <h3>{todo.title}</h3>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="no-todos">No todos yet. Add some!</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;
