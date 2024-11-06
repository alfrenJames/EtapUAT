import React, { useState } from 'react';

const EditNotification = ({ notification, onUpdate, onClose }) => {
    const [message, setMessage] = useState(notification.message);
    const [notifType, setNotifType] = useState(notification.notif_type);
    const [notifStatus, setNotifStatus] = useState(notification.notif_status);

    const handleSave = () => {
        onUpdate({ ...notification, message, notif_type: notifType, notif_status: notifStatus });
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title">Update Notification</h5>
            <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
            </button>
            </div>
            <div className="modal-body">
            <div className='modal-content'>
                    <textarea 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Message" 
                    />
                    <select 
                        value={notifType} 
                        onChange={(e) => setNotifType(e.target.value)}
                    >
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="promotion">Promotion</option>
                    </select>
                    <select 
                        value={notifStatus} 
                        onChange={(e) => setNotifStatus(e.target.value)}
                    >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                    <button onClick={handleSave}>Save</button>
                    </div>
                    </div>
                </div>
            </div>
            </div>
);
};

export default EditNotification;