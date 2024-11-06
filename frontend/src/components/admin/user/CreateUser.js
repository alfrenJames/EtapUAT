import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context
import { storage } from '../../../services/firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary Firebase functions

const CreateUser = () => {
  const navigate = useNavigate();
  const { sidebarOpen } = useSidebar(); // Get sidebar state
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    course: '',
    section: '',
    emailAddress: '',
    contactNumber: '',
    idUrl: '',
    password: '',
    creditAmount: 0,
    creditRide: 0,
    status: 'active',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null); // State to hold the selected file

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Set the selected file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (file) {
      const storageRef = ref(storage, `images/${file.name}`); // Create a reference to the file
      try {
        await uploadBytes(storageRef, file); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL

        // Prepare form data to send to the backend
        const userData = {
          ...formData,
          idUrl: downloadURL, // Add the download URL to form data
        };

        const response = await api.post('/users', userData);
        setSuccess('User created successfully');
        setFormData({
          lastName: '',
          firstName: '',
          course: '',
          section: '',
          emailAddress: '',
          contactNumber: '',
          idUrl: '',
          password: '',
          creditAmount: 0,
          creditRide: 0,
          status: 'active',
        });
        setFile(null); // Reset the file input
      } catch (error) {
        setError(error.response?.data?.message || 'Error creating user');
      }
    } else {
      setError('Please select an image file to upload.');
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar /> {/* Include the Sidebar */}
      <div className="container mt-5">
        <h2>Create New User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="course" className="form-label">Course</label>
            <input type="text" className="form-control" id="course" name="course" value={formData.course} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="section" className="form-label">Section</label>
            <input type="text" className="form-control" id="section" name="section" value={formData.section} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="emailAddress" className="form-label">Email Address</label>
            <input type="email" className="form-control" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input type="tel" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="idUrl" className="form-label">ID Picture</label>
            <input type="file" className="form-control" id="idUrl" name="idUrl" accept="image/*" onChange={handleFileChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="creditAmount" className="form-label">Credit Amount</label>
            <input type="number" className="form-control" id="creditAmount" name="creditAmount" value={formData.creditAmount} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="creditRide" className="form-label">Credit Rides</label>
            <input type="number" className="form-control" id="creditRide" name="creditRide" value={formData.creditRide} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select className="form-control" id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create User</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;