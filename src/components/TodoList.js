import React, { useState, useEffect } from 'react';

const TodoList = ({ username }) => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:5000/todos?username=${username}`);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoInput.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        title: todoInput,
        completed: false,
      };

      try {
        const response = await fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, todo: newTodo }),
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data);
          setTodoInput('');
        } else {
          console.error('Error adding todo:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.error('Error deleting todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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
