import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ToggleLed from './ToggleLed';

const StartRentModal = ({ user, onClose, onSuccess, dashboard }) => {
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const toggleLedRef = useRef();

    useEffect(() => {
        const fetchAvailableUnits = async () => {
            try {
                setLoading(true);
                const response = await api.get('/units', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                setUnits(response.data);
            } catch (err) {
                setError('Failed to fetch available units');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableUnits();
    }, [user.token]);

    const handleStartRent = async (e) => {
        e.preventDefault();
        if (!selectedUnit || !selectedRoute) {
            setError('Please select a unit and a parking route');
            return;
        }

        // Check if the user has enough ride credits
        if (dashboard.creditRide <= 0) {
            setError('Insufficient ride credits. Please buy more credits to start riding.');
            onClose(); // Close the modal if credits are insufficient
            return;
        }

        // Start loading and save the transaction
        setLoading(true);
        
        try {
            const response = await api.post('/transaction', {
                user_id: user._id,
                unit_number: selectedUnit,
                start_part: units.find(unit => unit._id === selectedUnit)?.last_parking_route,
                end_park: selectedRoute,
                credit_ride: user.creditRide,
                created_by: user._id,
                created_by_model: "Admin"
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            console.log('Transaction successful:', response.data);
            setCountdown(300); // Reset countdown to 5 minutes
            startCountdown(); // Start the countdown
            toggleLedRef.current.toggleLed(); // Call toggleLed when rental starts
            onSuccess();
        } catch (err) {
            console.error('Transaction error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to start rental');
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    const startCountdown = () => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    toggleLedRef.current.toggleLed(); // Call toggleLed when countdown reaches 0
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const routeDescriptions = [
        "Gate 1",
        "Hotel 1",
        "Hotel 2",
        "Hotel 3",
        "Hotel 4",
        "MAB entrance 1",
        "MAB entrance 2",
        "Accounting",
        "Arnaiz Building",
        "Gate 2",
        "Gym"
      ];

      const routeMap = {
        "Route 01": "Gate 1",
        "Route 02": "Hotel 1",
        "Route 03": "Hotel 2",
        "Route 04": "Hotel 3",
        "Route 05": "Hotel 4",
        "Route 06": "MAB entrance 1",
        "Route 07": "MAB entrance 2",
        "Route 08": "Accounting",
        "Route 09": "Arnaiz Building",
        "Route 10": "Gate 2",
        "Route 11": "Gym"
    };
    

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Start Rental</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <form onSubmit={handleStartRent}>
                            <div className="mb-4">
                                <label htmlFor="unitSelect" className="form-label">Select Available Unit</label>
                                <select
                                    id="unitSelect"
                                    className="form-select form-select-lg"
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">Choose a unit...</option>
                                    {units
                                        .filter(unit => unit.condition === "online")
                                        .map(unit => (
                                            <option key={unit._id} value={unit._id}>
                                                Unit {unit.unit_number}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="endPark" className="form-label">Select Parking Route</label>
                                <select
                                    id="endPark"
                                    className="form-select form-select-lg"
                                    value={selectedRoute}
                                    onChange={(e) => setSelectedRoute(e.target.value)}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">Select a route...</option>
                                    {['Route 01', 'Route 02', 'Route 03', 'Route 04', 'Route 05', 'Route 06', 'Route 07', 'Route 08', 'Route 09', 'Route 10', 'Route 11'].map((route, index) => (
                                        <option key={route} value={route}>{routeDescriptions[index]}</option>
                                    ))}
                                </select>
                                <p>
                                    {units
                                        .filter(unit => unit.condition === "online")
                                        .map(unit => (
                                            <option key={unit._id} value={unit._id}>
                                                Park At: {routeMap[units.find(unit => unit._id === unit._id)?.last_parking_route]}
                                            </option>
                                        ))}
                                </p>
                            </div>

                            <div className="d-grid gap-2">
                                <ToggleLed ref={toggleLedRef} />
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg"
                                    disabled={loading || !selectedUnit || !selectedRoute}
                                >
                                    {loading ? 'Starting Rental...' : 'Start Rental'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                    disabled={loading}
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

export default StartRentModal;