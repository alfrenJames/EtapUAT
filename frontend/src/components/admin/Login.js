import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './login.css'; // Import the CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/admin/login', { username, password });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container d-flex">
      <div className="login-image">
        <img src="/img/WeTap.png" alt="WeTap" /> {/* Update the path to your image */}
      </div>
      <div className="login-form">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Admin Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;