import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const BuyCreditModal = ({ user, onClose, onUpdate, refreshData }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    amount: 0,
    createdBy: ""
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedRides, setSelectedRides] = useState(0);
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);

  const creditOptions = [
    { amount: 100, rides: 20 },
    { amount: 80, rides: 15 },
    { amount: 60, rides: 10 },
    { amount: 40, rides: 5 }
  ];
   useEffect(() => {
    if (user) {
      setFormData({
        user_id: user._id,
      });
    }
  }, [user]);
  useEffect(() => {
    // Fetch users, units, and admin ID from the API
    const fetchData = async () => {
      try {
        const [adminResponse] = await Promise.all([
          api.get('/admin') // Endpoint to get admin details
        ]);

        // Assuming adminResponse.data is an array and you want the first admin's ID
        const firstAdminId = adminResponse.data[0]?._id || '';
        setFormData(prevFormData => ({
          ...prevFormData,
          createdBy: firstAdminId // Set the first admin ID
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    setIsUpdateEnabled(totalAmount <= user.creditAmount); // Assuming user.creditAmount is available
  }, [totalAmount, user.creditAmount]);

  const handleCheckboxChange = (amount, rides, isChecked) => {
    if (isChecked) {
      setTotalAmount(prev => prev + amount);
      setSelectedRides(prev => prev + rides);
    } else {
      setTotalAmount(prev => prev - amount);
      setSelectedRides(prev => prev - rides);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        user_id: formData.user_id,
        amount: totalAmount, // Amount to deduct
        createdBy: formData.createdBy, // Include createdBy from formData
      };
      const response = await api.post(`/payment/buy`, updatedData); // Call the createBuyPayment endpoint
      onUpdate(response.data); // Update the parent component with the new payment data
      refreshData();
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating Buy Payment:', error);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Buy Ride Credits</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className='d-flex'>
                <div className="mb-3">
                  <label htmlFor="currentRides" className="form-label">Current Rides</label>
                  <input type="number" className="form-control" id="creditRide" name="creditRide" value={user.creditRide} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="creditAmount" className="form-label">Credit Amount</label>
                  <input type="number" className="form-control" id="creditAmount" name="creditAmount" value={user.creditAmount} disabled />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Select Credit Options</label>
                {creditOptions.map(option => (
                  <div key={option.amount} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`creditOption${option.amount}`}
                      onChange={(e) => handleCheckboxChange(option.amount, option.rides, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`creditOption${option.amount}`}>
                      PHP {option.amount} = {option.rides} rides
                    </label>
                  </div>
                ))}
              </div>
              <div className="form-group mb-2">
                <label htmlFor="created_by">Created By</label>
                <input
                    type="text"
                    id="createdBy"
                    name="createdBy"
                    className="form-control"
                    value={formData.createdBy}
                    readOnly
                    disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="totalAmount" className="form-label">Total Amount</label>
                <input type="number" className="form-control" id="totalAmount" name="totalAmount" value={totalAmount} readOnly />
              </div>
              <div className="mb-3">
                <label htmlFor="totalRides" className="form-label">Total Rides</label>
                <input type="number" className="form-control" id="totalRides" name="totalRides" value={selectedRides} readOnly />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!isUpdateEnabled}>Buy Ride Credits</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditModal;