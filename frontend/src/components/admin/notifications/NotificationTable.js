import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
// import './css/notificationTable.css'; // Add your CSS file
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context
import NotificationDetails from './NotificationDetails'; // Import NotificationDetails component
import EditNotification from './EditNotification';
import CreateNotification from './CreateNotification';

const NotificationTable = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [creatingNotification, setCreatingNotification] = useState(false);

   const handleCreate = (newNotification) => {
     setNotifications([...notifications, newNotification]); // Add the new notification to the list
   };
 

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notification');
      setNotifications(response.data);
    } catch (error) {
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
  };

  const handleDelete = async (notificationId) => {
    try {
      // Update the notification status to "closed"
      await api.put(`/notification/${notificationId}`, { notif_status: "closed" });
      setNotifications(notifications.map(notification => 
        notification._id === notificationId ? { ...notification, notif_status: "closed" } : notification
      ));
      setMessage("Status in now Updated to Closed");
    } catch (error) {
      setError('Error updating notification status');
    }
  };

  const handleUpdate = async (updatedNotification) => {
    try {
      await api.put(`/notification/${updatedNotification._id}`, updatedNotification);
      setEditingNotification(null); // Close the edit modal
      fetchNotifications(); // Refresh notifications after update
      setMessage('Notification Successfully Updated');
    } catch (error) {
      setError('Error updating notification');
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar ref={sidebarRef} />
      <div className="container mt-5 d-inline">
        <header>
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>Notification List</h2>
          <button className="btn btn-success" onClick={() => setCreatingNotification(true)}>Create Notification</button>
        </header>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Message Type</th>
                <th>Message Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center">🤔Loading...</td>
                </tr>
              ) : notifications.length > 0 ? (
                notifications.map(notification => (
                  <tr key={notification._id}>
                    <td>{notification._id}</td>
                    <td>{notification.message}</td>
                    <td>{notification.notif_type}</td>
                    <td>{notification.notif_status}</td>
                    <td>{notification.creadedtime}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(notification)}>Edit</button>
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(notification)}>View Details</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(notification._id)}>Deactivate</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No notifications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingNotification && (
        <EditNotification
          notification={editingNotification}
          onClose={() => setEditingNotification(null)}
          onUpdate={handleUpdate} // Refresh notifications after update
        />
      )}
       {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />)}
        {creatingNotification && (
        <CreateNotification
          onClose={() => setCreatingNotification(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default NotificationTable;