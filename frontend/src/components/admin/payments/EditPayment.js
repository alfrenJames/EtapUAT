import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
// import './css/editPayment.css'; // Optional: Add your CSS for styling

const EditPayment = ({ payment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ref_number: '',
    user_id: '',
    amount: '',
    payment_status: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        ref_number: payment.ref_number,
        user_id: payment.user_id,
        amount: payment.amount,
        payment_status: payment.payment_status
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/payment/${payment._id}`, formData);
      onUpdate(); // Refresh the payment data
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Payment</h2>
        <form onSubmit={handleSubmit} className='container my-2'>
          <div className="form-group mx-2 my-2">
            <label>Reference Number</label>
            <input
              type="text"
              name="ref_number"
              value={formData.ref_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mx-2 my-2">
            <label>User Name</label>
            <input
              type="text"
              name="user_id"
              value={`${formData.user_id.lastName} ${formData.user_id.firstName}`}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group mx-2 my-2">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mx-2 my-2">
            <label>Status</label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              required
              disabled
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Update Payment</button>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;