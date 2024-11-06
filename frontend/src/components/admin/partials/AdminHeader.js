import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminHeader = ({ adminName, onLogout, toggleSidebar, sidebarOpen }) => {
    
  return (
    <header>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      <h1>Welcome, {adminName}!</h1>
      <button className="btn btn-danger" onClick={onLogout}>Logout</button>
    </header>
  );
};

export default AdminHeader;