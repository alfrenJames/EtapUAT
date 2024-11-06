import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const CreateNotification = ({ onClose, onCreate }) => {
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('');
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const adminResponse = await api.get('/admin'); // Fetch admin details
        const firstAdminId = adminResponse.data[0]?._id || ''; // Get the first admin's ID
        setAdminId(firstAdminId); // Set the admin ID state
      } catch (error) {
        setError('Error fetching admin details');
      }
    };

    fetchAdminId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/notification', { 
        message,
        notif_status:"open", 
        notif_type: notifType, 
        created_by: adminId // Use the fetched admin ID
      });
      onCreate(response.data); // Pass the new notification back to the parent
      onClose(); // Close the modal
    } catch (error) {
      setError('Error creating notification');
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Notification</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Message:</label>
                <textarea 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Create Notifications to users"
                        className="form-group d-block" 
                />
              </div>
              <div className="form-group">
                <label>Message Type:</label>
                <select 
                  className="form-control" 
                  value={notifType} 
                  onChange={(e) => setNotifType(e.target.value)} 
                  required
                >
                  <option value="">Select Type</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" disabled={!adminId}>Create</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;