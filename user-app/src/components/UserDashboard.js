import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/dashboard.css';
import api from '../services/api';
import BuyCreditsModal from './BuyCreditModal';
import PaymentCreditModal from './PaymentCreditModal';
import StartRentModal from './StartRentModal';

const UserDashboard = ({ user, onLogout }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateCredit, setUpdateCredit] = useState(null);
    const [paymentCredit, setPaymentCredit] = useState(null);
    const [showStartRent, setShowStartRent] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch user data
            const response = await api.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const userData = response.data;

            // Fetch transactions
            const transactionsResponse = await api.get(`/transaction/user/${userId}/count`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const transactions = transactionsResponse.data.count;

            // Fetch open notifications
            const notificationsResponse = await api.get('/notification/status', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setNotifications(notificationsResponse.data);
            setDashboardData({
                ...userData,
                transactionCount: transactions,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, [user, userId, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        onLogout();
        navigate('/');
    };

    const handleRefresh = () => {
        fetchDashboardData();
    };

    const handleUpdateCredit = (user) => {
        setUpdateCredit(user);
    };

    const handleUpdatePayment = (user) => {
        setPaymentCredit(user);
    };

    const refreshData = () => {
        fetchDashboardData();
    };

    const handleStartRent = () => {
        if (dashboardData.creditRide > 0) {
            setShowStartRent(true);
        } else {
            // You might want to show an alert or message
            alert("Insufficient ride credits. Please buy more credits to start riding.");
        }
    };

    if (loading) {
        return <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <i className='bx bx-loader-alt bx-spin text-primary' style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3">Loading...</h4>
                <p className="text-muted">Please wait while we process the request</p>
                <p className="text-muted">Thank you! Happy Riding 🚲</p>
            </div>
        </div>
    }

    if (!user || !dashboardData) {
        return <div>User not found</div>;
    }

    return (
        <div className="min-vh-100" style={{backgroundColor: '#f5f5f5'}}>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p className="text-muted" style={{ display: 'none'}}>No new notifications</p>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification._id} className="notification-item mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-center">
                                {new Date(notification.createdtime).toLocaleDateString()}
                                <p className="mx-2">{notification.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="row">
                <div className="ps-lg-5 ps-sm-4 py-4 pe-3 col-md-12 d-flex flex-row align-items-center font-16 purple-color-2">
                    <div className="logo me-auto">
                        <img src='/assets/img/Etap.png' alt="logo" style={{ cursor: 'pointer' }} onClick={handleRefresh}/>
                    </div>
                    <p className='mx-4'>Hi! <span>{user.firstName}</span></p>
                    <button className="btn mx-4 mt-3" type="button" onClick={handleLogout}>
                        <i className="fa fa-power-off" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm purple-bg-color text-white">
                            <div className="card-body p-4">
                                {/* Balance Section */}
                                <div className="mb-4">
                                    <small className="text-uppercase opacity-75">Balance Details</small>
                                    <h2 className="display-6 fw-bold mb-1">{dashboardData.creditAmount}</h2>
                                    <small className="opacity-75">PHP Total Credit Balance</small>
                                </div>

                                {/* Stats Row */}
                                <div className="row mb-4">
                                    <div className="col-6">
                                        <h5 className="fw-bold mb-1" id="totalRides">
                                            {dashboardData.creditRide}
                                        </h5>
                                        <small className="opacity-75">Total Ride Credits</small>
                                    </div>
                                    <div className="col-6">
                                        <h5 className="fw-bold mb-1">
                                            {dashboardData.transactionCount}
                                        </h5>
                                        <small className="opacity-75">Rides Completed</small>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-light btn-lg mb-3"
                                        onClick={handleStartRent}
                                        disabled={dashboardData.creditRide <= 0}
                                    >
                                        🚲 Start Rent
                                    </button>
                                    
                                    <div className="d-flex justify-content-center gap-2">
                                        <button 
                                            className="btn btn-warning"
                                            onClick={() => handleUpdateCredit(dashboardData)}
                                        >
                                            💳 Buy Credits
                                        </button>
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => handleUpdatePayment(dashboardData)}
                                        >
                                            <img 
                                                src='https://brandlogos.net/wp-content/uploads/2024/01/gcash-logo_brandlogos.net_kiaqh-768x641.png' 
                                                style={{width: '2rem', height: 'auto'}}
                                                alt="GCash"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {updateCredit && (
                <BuyCreditsModal
                    user={updateCredit}
                    onClose={() => setUpdateCredit(null)}
                    onUpdate={refreshData}
                    refreshData={refreshData}
                />
            )}

            {paymentCredit && (
                <PaymentCreditModal
                    user={paymentCredit}
                    onClose={() => setPaymentCredit(null)}
                    onUpdate={refreshData}
                />
            )}

            {showStartRent && (
                <StartRentModal
                    user={user}
                    onClose={() => setShowStartRent(false)}
                    onSuccess={refreshData}
                    dashboard={dashboardData}
                />
            )}
        </div>
    );
};

export default UserDashboard;
