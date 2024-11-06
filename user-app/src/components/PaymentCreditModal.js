import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PaymentCreditModal = ({ user, onClose, onUpdate }) => {
    const [amount, setAmount] = useState('');
    const [adminId, setAdminId] = useState('');
    const [refNumber, setRefNumber] = useState('');
    const [showImage, setShowImage] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adminResponse] = await Promise.all([
                    api.get('/admin')
                ]);
                const firstAdminId = adminResponse.data[0]?._id || '';
                setAdminId(firstAdminId);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payment/pay', {
                user_id: user._id,
                amount: parseFloat(amount),
                createdBy: adminId,
                ref_number: refNumber
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    const handleImageClick = () => {
        setShowImage(true);
    };

    const handleCloseImage = () => {
        setShowImage(false);
    };

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">
                            <img 
                                src='https://brandlogos.net/wp-content/uploads/2024/01/gcash-logo_brandlogos.net_kiaqh-768x641.png' 
                                style={{width: '2rem', height: 'auto', marginRight: '10px'}}
                                alt="GCash"
                            />
                            Add GCash Credits
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* User Info Card */}
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">User Details</h6>
                                    <p className="card-text mb-0">
                                        Name: {user.firstName} {user.lastName}
                                    </p>
                                    <p className="card-text mb-0">
                                        Current Balance: PHP {user.creditAmount}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="amount"
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="amount">Amount (PHP)</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="refNumber"
                                            placeholder="Enter reference number"
                                            value={refNumber}
                                            onChange={(e) => setRefNumber(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="refNumber">Ref No.</label>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="alert alert-info mb-4" role="alert">
                                <h6 className="alert-heading">Payment Instructions:</h6>
                                <ol className="mb-0">
                                    <li>Send the payment to GCash number: 0921 707 0264</li>
                                    <li>Or Scan Here</li>
                                    <img 
                                        src='/assets/img/Gcash_QR_code.jpg' 
                                        alt="logo" 
                                        style={{ cursor: 'pointer'}} 
                                        onClick={handleImageClick}
                                    />
                                    <li>Enter the amount you sent</li>
                                    <li>Enter the reference number from your GCash transaction</li>
                                </ol>
                            </div>

                            {/* Modal for larger image */}
                            {showImage && (
                                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">GCash QR Code</h5>
                                                <button type="button" className="btn-close" onClick={handleCloseImage}></button>
                                            </div>
                                            <div className="modal-body">
                                                <img 
                                                    src='/assets/img/Gcash_QR_code.jpg' 
                                                    alt="GCash QR Code" 
                                                    style={{ width: '100%', height: 'auto' }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-grid gap-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                >
                                    Submit Payment
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCreditModal; 