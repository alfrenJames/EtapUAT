import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginModal = ({ isVisible, onClose, onLogin }) => {
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  
    if (!isVisible) return null;
  
    const validateLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');
  
        try {
            const response = await api.post('/access/login', {
                emailAddress,
                password,
            });
        
            const userData = response.data;
            if (userData) {
                onLogin(userData);
                navigate(`/dashboard/${userData._id}`);
            } else {
                setErrorMessage('User data is undefined');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="modal" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={validateLogin}>
                            <div className="mb-3">
                                <label htmlFor="emailAddress" className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    name="password" 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
