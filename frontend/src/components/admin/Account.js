import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import api from '../../services/api';
import '../admin/css/adminDashboard.css';
import Sidebar from '../admin/partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../common/SlidebarContext'; // Import the Sidebar context
import { FaBars, FaTimes } from 'react-icons/fa';
import UpdateAdminModal from './UpdateAdminModal'; // Modal for updating admin details

const Account = () => {
    const { id: adminId } = useParams(); // Get adminId from route parameters
    console.log('Admin ID:', adminId); // Debugging line
    const navigate = useNavigate(); // Initialize useNavigate
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
    const { sidebarOpen, toggleSidebar } = useSidebar();
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (adminId) {
            fetchAdminDetails();
        } else {
            setError('Admin ID is not defined.');
            setLoading(false);
        }
    }, [adminId]);

    const fetchAdminDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/${adminId}`); // Adjust the endpoint as necessary
            setAdmin(response.data);
        } catch (error) {
            setError('Error fetching admin details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAdmin = async (updatedAdmin) => { // Function to handle admin update
        try {
            await api.put(`/account/${adminId}`, updatedAdmin); // Adjust the endpoint as necessary
            fetchAdminDetails(); // Refresh the admin details
            setModalIsOpen(false); // Close the modal
        } catch (error) {
            setError('Error updating admin details');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to the login page
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar ref={sidebarRef} />
            <div className="container mt-5">
                <h2>Admin Account Details</h2>
                <header>
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <button className="btn btn-primary" onClick={() => setModalIsOpen(true)}>Update Admin</button> {/* Button to open modal */}
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button> {/* Logout button */}
                </header>
                <UpdateAdminModal 
                    isOpen={modalIsOpen} 
                    onRequestClose={() => setModalIsOpen(false)} 
                    onUpdate={handleUpdateAdmin} 
                    admin={admin} // Pass current admin details to the modal
                />
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Avatar</th>
                            <th>Created Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{admin.username}</td>
                            <td><img src={admin.avatar_url} alt="Admin Avatar" style={{ width: '50px', height: '50px' }} /></td>
                            <td>{new Date(admin.createdTime).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Account;