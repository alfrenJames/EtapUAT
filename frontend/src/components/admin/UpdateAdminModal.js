import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Make sure to install react-modal
// import './UpdateAdminModal.css'; // Optional: Add your styles here

const UpdateAdminModal = ({ isOpen, onRequestClose, onUpdate, admin }) => {
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (admin) {
            setUsername(admin.username);
            setAvatarUrl(admin.avatar_url);
        }
    }, [admin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedAdmin = {
            username,
            avatar_url: avatarUrl,
        };
        onUpdate(updatedAdmin); // Call the onUpdate function with the updated admin data
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Update Admin"
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Update Admin Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="avatarUrl">Avatar URL</label>
                    <input
                        type="text"
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default UpdateAdminModal;