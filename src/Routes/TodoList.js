import React, { useState, useEffect } from 'react';

const TodoList = ({ username }) => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

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
        todoContent: todoInput,
        completed: false,
      };

      try {
        const response = await fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, todoContent: newTodo.todoContent }),
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

  const handleEditStart = (id, currentText) => {
    setEditTodoId(id);
    setEditTodoText(currentText);
  };

  const handleEditCancel = () => {
    setEditTodoId(null);
    setEditTodoText('');
  };

  const handleEditSave = async (id) => {
    try {
      const updatedTodo = { id, todoContent: editTodoText };

      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, todoContent: updatedTodo.todoContent }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        setEditTodoId(null);
        setEditTodoText('');
      } else {
        console.error('Error updating todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <form onSubmit={handleSubmit} className="todo-form">
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
            <div key={todo._id} className="todo-item">
              {editTodoId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editTodoText}
                    onChange={(e) => setEditTodoText(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    className="save-btn"
                    onClick={() => handleEditSave(todo._id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{todo.todoContent}</h3>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditStart(todo._id, todo.todoContent)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </>
              )}
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
