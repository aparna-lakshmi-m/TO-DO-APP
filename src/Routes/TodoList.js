// TodoList.js
import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { AppContext } from '../App';

const TodoList = ({ username }) => {
  const {test,isLoggedIn,setIsLoggedIn} = useContext(AppContext)
  console.log(test);
  console.log(isLoggedIn);

  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

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
    setTimeout(()=>{
      setIsLoggedIn("false")
    },5000)
  }, [username]);

  const handleAddTodo = async (values) => {
    const newTodo = {
      id: Date.now(),
      todoContent: values.todoContent,
      completed: false,
      dueDate: values.dueDate,
      category: values.category,
    };

    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          todoContent: newTodo.todoContent, 
          dueDate: newTodo.dueDate, 
          category: newTodo.category 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        setModalIsOpen(false);
      } else {
        console.error('Error adding todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
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
        setDeleteConfirmModalIsOpen(false);
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

  const handleCheckboxChange = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, completed }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.error('Error updating todo status:', response.statusText);
      }
    } catch (error) { 
      console.error('Error updating todo status:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  }).filter(todo => todo.todoContent.toLowerCase().includes(searchTerm.toLowerCase()));

  const openDeleteConfirmModal = (todo) => {
    setTodoToDelete(todo);
    setDeleteConfirmModalIsOpen(true);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      handleDeleteTodo(todoToDelete._id);
      setTodoToDelete(null);
    }
  };

  return (
    <div className="todo-list">
      <h2 className="todo-title">Todo List</h2>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search todos..."
        className="search-input"
      />
      <button className="add-todo-btn" onClick={() => setModalIsOpen(true)}>+</button>

      <div className="todos">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo._id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleCheckboxChange(todo._id, !todo.completed)}
                className="todo-checkbox"
              />
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
                  <h3 className={todo.completed ? 'completed-todo' : ''}>{todo.todoContent}</h3>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditStart(todo._id, todo.todoContent)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => openDeleteConfirmModal(todo)}
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

      {/* Add Todo Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Todo"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add Todo</h2>
        <Formik
          initialValues={{ todoContent: '', dueDate: '', category: 'weekday' }}
          validationSchema={Yup.object({
            todoContent: Yup.string().required('Required'),
            dueDate: Yup.date().required('Required'),
            category: Yup.string().required('Required')
          })}
          onSubmit={handleAddTodo}
        >
          <Form className="form">
            <label htmlFor="todoContent">Todo Task</label>
            <Field name="todoContent" type="text" />
            <ErrorMessage name="todoContent" component="div" />

            <label htmlFor="dueDate">Due Date</label>
            <Field name="dueDate" type="date" />
            <ErrorMessage name="dueDate" component="div" />

            <label htmlFor="category">Category</label>
            <Field as="select" name="category">
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
              <option value="personal">Personal</option>
            </Field>
            <ErrorMessage name="category" component="div" />

            <button type="submit" className="create-btn">Create</button>
          </Form>
        </Formik>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmModalIsOpen}
        onRequestClose={() => setDeleteConfirmModalIsOpen(false)}
        onConfirm={confirmDeleteTodo}
        message="Are you sure you want to delete this todo?"
      />
    </div>
  );
};

export default TodoList;
