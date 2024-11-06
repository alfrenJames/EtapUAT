import React from 'react';
// import './css/paymentDetails.css'; // Optional: Add your CSS for styling

const PaymentDetails = ({ payment, onClose }) => {
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Payment Details</h2>
        <p><strong>Reference Number:</strong> {payment.ref_number}</p>
        <p><strong>User ID:</strong> {payment.user_id._id}</p> {/* Displaying user ID */}
        <p><strong>User Name:</strong> {payment.user_id.firstName} {payment.user_id.lastName}</p> {/* Displaying user's name */}
        <p><strong>Amount:</strong> PHP {payment.amount}</p>
        <p><strong>Status:</strong> {payment.payment_status}</p>
        <p><strong>Date Created:</strong> {new Date(payment.createdTime).toLocaleString()}</p>
        {/* Add more fields as necessary */}
      </div>
    </div>
  );
};

export default PaymentDetails;