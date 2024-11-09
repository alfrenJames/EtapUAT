import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import '../../admin/css/adminDashboard.css';
import api from '../../../services/api';
import { ref as firebaseRef, set } from 'firebase/database'; // Rename the ref import
import { database } from '../../../services/firebase'; // Import the database instance

const CreateTransactionModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    unit_number: '',
    end_park: '',
    created_by: '', // Initialize as empty
    created_by_model: 'Admin' // Always "Admin"
  });

  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    // Fetch users, units, and admin ID from the API
    const fetchData = async () => {
      try {
        const [usersResponse, unitsResponse, adminResponse] = await Promise.all([
          api.get('/users'),
          api.get('/units'),
          api.get('/admin') // Endpoint to get admin details
        ]);

        setUsers(usersResponse.data);
        setUnits(unitsResponse.data);

        // Assuming adminResponse.data is an array and you want the first admin's ID
        const firstAdminId = adminResponse.data[0]?._id || '';
        setFormData(prevFormData => ({
          ...prevFormData,
          created_by: firstAdminId // Set the first admin ID
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Check if user's creditRide is less than or equal to zero
     if (formData.user_id && users.find(user => user._id === formData.user_id)?.creditRide <= 0) {
      alert('Transaction cannot be created. User has insufficient credit.');
      return; // Exit the function if the condition is met
    }
    try {
      const response = await api.post('/transaction', formData);
      console.log('Transaction created:', response.data);
      refreshData();
      onClose(); // Close the modal after successful submission
      set(firebaseRef(database, 'Led1Status'), "1"); // turn on unit
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Transaction" style={{ overlay: { zIndex: 1000 } }}>
      <button type="button" className="btn-close" onClick={onClose}></button>
      <h2>Create Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_id">User</label>
          <select
            id="user_id"
            name="user_id"
            className="form-control"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {users.filter(user => user.status === 'active').map(user => (
              <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="unit_number">Unit Number</label>
          <select
            id="unit_number"
            name="unit_number"
            className="form-control"
            value={formData.unit_number}
            onChange={handleChange}
            required
          >
            <option value="">Select a unit</option>
            {units.filter(unit => unit.condition !== 'damaged').map(unit => ( // Filter for damaged units
              <option key={unit._id} value={unit._id}>{unit.unit_number}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="end_park">Select Parking Route</label>
          <select
            id="end_park"
            name="end_park"
            className="form-control"
            value={formData.end_park}
            onChange={handleChange}
            required
          >
            {['Route 01', 'Route 02', 'Route 03', 'Route 04', 'Route 05', 'Route 06', 'Route 07', 'Route 08', 'Route 09', 'Route 10', 'Route 11'].map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="created_by">Created By</label>
          <input
            type="text"
            id="created_by"
            name="created_by"
            className="form-control"
            value={formData.created_by}
            readOnly
            disabled
          />
        </div>
        <button type="submit" className="btn btn-primary mx-1">Submit</button>
        <button type="button" className="btn btn-secondary mx-1" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default CreateTransactionModal;