import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const UpdateCreditsModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    creditAmount: 0,
    creditRide: 0,
    idUrl: ''
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
        creditAmount: user.creditAmount,
        creditRide: user.creditRide,
        idUrl: user.idUrl
      });
    }
  }, [user]);

  useEffect(() => {
    setIsUpdateEnabled(totalAmount <= formData.creditAmount);
  }, [totalAmount, formData.creditAmount]);

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
        ...formData,
        creditRide: formData.creditRide + selectedRides, // Add selected rides to current rides
        creditAmount: formData.creditAmount - totalAmount // Deduct total amount from current credit amount
      };
      const response = await api.put(`/users/${user._id}`, updatedData);
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
            <h5 className="modal-title">Update User's Credit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className='d-flex'>
                <div className="mb-3">
                  <label htmlFor="currentRides" className="form-label">Current Rides</label>
                  <input type="number" className="form-control" id="creditRide" name="creditRide" value={formData.creditRide} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="creditAmount" className="form-label">Credit Amount</label>
                  <input type="number" className="form-control" id="creditAmount" name="creditAmount" value={formData.creditAmount} disabled />
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

export default UpdateCreditsModal;