import React from 'react';

const NotificationDetails = ({ notification, onClose }) => {
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Notification Details</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <p><strong>ID:</strong> {notification._id}</p>
            </div>
            <div className="mb-3">
              <p><strong>Message:</strong> {notification.message}</p>
            </div>
            <div className="mb-3">
              <p><strong>Type:</strong> {notification.notif_type}</p>
            </div>
            <div className="mb-3">
              <p><strong>Status:</strong> {notification.notif_status}</p>
            </div>
            <div className="mb-3">
              <p><strong>Date:</strong> {notification.createdtime}</p>
            </div>
            <div className="mb-3">
              <p><strong>Created By:</strong> {notification.created_by.username}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;