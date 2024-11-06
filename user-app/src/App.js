import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        }
    }, []);

    const handleLogin = (userData) => {
        console.log('Logged in user data:', userData);
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('userData');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to={`/dashboard/${user._id}`} /> : <LandingPage onLogin={handleLogin} />} />
                <Route 
                    path="/dashboard/:userId" 
                    element={user ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;