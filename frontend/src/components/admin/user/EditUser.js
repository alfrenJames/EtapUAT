import React, { useState, useEffect} from 'react';
import api from '../../../services/api';
import { storage } from '../../../services/firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary Firebase functions

const EditUser = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    course: '',
    section: '',
    emailAddress: '',
    contactNumber: '',
    creditAmount: 0,
    creditRide: 0,
    status: '',
    idUrl: ''  // Added idUrl to the form data
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        course: user.course,
        section: user.section,
        emailAddress: user.emailAddress,
        contactNumber: user.contactNumber,
        creditAmount: user.creditAmount,
        creditRide: user.creditRide,
        status: user.status,
        idUrl: user.idUrl  // Set idUrl from user data
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`); // Create a reference to the file
      try {
        await uploadBytes(storageRef, file); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        setFormData((prevData) => ({ ...prevData, idUrl: downloadURL })); // Update idUrl with the download URL
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user._id}`, formData);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
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
                <label htmlFor="creditAmount" className="form-label">Credit Amount</label>
                <input type="number" className="form-control" id="creditAmount" name="creditAmount" value={formData.creditAmount} onChange={handleChange} required  disabled/>
              </div>
              <div className="mb-3">
                <label htmlFor="creditRide" className="form-label">Credit Ride</label>
                <input type="number" className="form-control" id="creditRide" name="creditRide" value={formData.creditRide} onChange={handleChange} required  disabled/>
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select className="form-select" id="status" name="status" value={formData.status} onChange={handleChange} required>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="idUrl" className="form-label">ID Picture URL</label>
                <input type="text" className="form-control" id="idUrl" name="idUrl" value={formData.idUrl} onChange={handleChange} required />
                <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" /> {/* New file input */}
              </div>
              <div className="mb-3">
                <img src={formData.idUrl} alt="ID Picture" style={{ width: '100px', height: 'auto' }} />
              </div>
              <button type="submit" className="btn btn-primary">Update User</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;