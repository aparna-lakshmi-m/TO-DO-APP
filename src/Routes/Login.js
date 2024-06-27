import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, setIsLoggedIn, setTodos }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          onLogin(values.username);
          setTodos(data.todos);
          navigate('/todos');
        } else {
          setErrors({ general: 'Invalid credentials. Please try again.' });
        }
      } catch (error) {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="login-form">
      <h2>Login</h2>
      {formik.errors.general && <p>{formik.errors.general}</p>}
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          {...formik.getFieldProps('username')}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          {...formik.getFieldProps('password')}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}

        <button type="submit" disabled={formik.isSubmitting}>Login</button>
      </form>
    </div>
  );
};

export default Login;
