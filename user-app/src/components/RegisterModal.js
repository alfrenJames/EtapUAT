import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RegisterModal = ({ isVisible, onClose }) => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        course: '',
        section: '',
        emailAddress: '',
        contactNumber: '',
        idUrl: '',
        password: '',
        status: 'inactive'
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    if (!isVisible) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const validateRegister = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            if (file) {
                const storageRef = ref(storage, `images/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);

                const userData = {
                    ...formData,
                    idUrl: downloadURL,
                };

                const response = await api.post('/access/register', userData);
                
                if (response.data) {
                    navigate(`/dashboard/${response.data._id}`);
                } else {
                    setErrorMessage('User data is undefined');
                }
            } else {
                setErrorMessage('Please select an ID picture to upload.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="modal" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Register</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={validateRegister}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="lastName" name="lastName" onChange={handleChange} required />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input type="text" className="form-control" id="firstName" name="firstName" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="course" className="form-label">Course</label>
                                    <input type="text" className="form-control" id="course" name="course" onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="section" className="form-label">Section</label>
                                    <input type="text" className="form-control" id="section" name="section" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="emailAddress" className="form-label">Email Address</label>
                                <input type="email" className="form-control" id="emailAddress" name="emailAddress" onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input type="tel" className="form-control" id="contactNumber" name="contactNumber" onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="idUrl" className="form-label">ID Picture</label>
                                <input type="file" className="form-control" id="idUrl" name="idUrl" accept="image/*" onChange={handleFileChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;