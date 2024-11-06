import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const PaymentCreditModal = ({ user, onClose, onUpdate }) => {
    const [amount, setAmount] = useState('');
    const [adminId, setAdminId] = useState('');
    const [refNumber, setRefNumber] = useState('');
    
    useEffect(() => {
        // Fetch users, units, and admin ID from the API
        const fetchData = async () => {
          try {
            const [adminResponse] = await Promise.all([
              api.get('/admin') // Endpoint to get admin details
            ]);
    
            // Assuming adminResponse.data is an array and you want the first admin's ID
            const firstAdminId = adminResponse.data[0]?._id || '';
            setAdminId(firstAdminId); // Set the admin ID in state
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [])
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payment/pay', {
                user_id: user._id,
                amount: parseFloat(amount),
                createdBy: adminId, // or the current user's ID
                ref_number: refNumber
            });
            onUpdate(); // Refresh user data
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    return (
        <div className="modal" style={{ display: 'block', zIndex: 1000 }}>
            <div className="modal-content">
                <h2>Add Credits for {user.firstName} {user.lastName}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                     <input
                        type="text" // Change to text for ref_number
                        placeholder="Enter reference number"
                        value={refNumber} // Bind refNumber state
                        onChange={(e) => setRefNumber(e.target.value)} // Update refNumber state
                        required
                    />
                    <button type="submit" className='btn btn-primary mx-2 my-2'>Submit</button>
                    <button type="button" className='btn btn-danger' onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentCreditModal;