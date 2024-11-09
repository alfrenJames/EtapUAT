import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { database } from '../firebaseConfig'; // Import the database
import { ref as firebaseRef, onValue, set } from 'firebase/database'; // Rename the ref import

const ToggleLed = forwardRef((_, ref) => {
    const [ledStatus, setLedStatus] = useState("0");
    const [countdown, setCountdown] = useState(300); // Add state for countdown
    const ledRef = useRef(); // Create a ref for the LED component

    useEffect(() => {
        const ledRefDb = firebaseRef(database, 'Led1Status'); // Use the renamed ref
        onValue(ledRefDb, (snapshot) => {
            const status = snapshot.val();
            setLedStatus(status);
        });
    }, []);

    useEffect(() => {
        if (ledStatus === "1") {
            setCountdown(300); // Set countdown to 5 minutes (300 seconds)
        } else {
            setCountdown(0); // Reset countdown if ledStatus is not "1"
        }
    }, [ledStatus]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        // setLedStatus("0"); // Set ledStatus to "0" when countdown reaches 0
                        toggleLed();
                        return 0; // Stop countdown
                    }
                    return prev - 1; // Decrease countdown
                });
            }, 1000); // Update every second

            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [countdown]);

    const toggleLed = () => {
        set(firebaseRef(database, 'Led1Status'), "1"); // Use the renamed ref
    };

    const toggleLedOff = () => {
        set(firebaseRef(database, 'Led1Status'), "0"); // Use the renamed ref
    };

    // Expose the toggleLed function to parent components
    useImperativeHandle(ref, () => ({
        toggleLed,
    }));

    return (
        <div className='d-flex flex-column align-items-center' ref={ledRef}>
            <div>
                {ledStatus === "1" && (
                    <>
                        <div>Countdown: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</div>
                        {countdown <= 120 && countdown > 0 && ( // Warning message for last 2 minutes
                            <div className="alert alert-warning">
                                Warning: Please park the unit to the designated route!
                            </div>
                        )}
                        {countdown === 0 && ( // Message when countdown reaches zero
                            <section>
                                <div className="alert alert-info">
                                Thank you for Renting!  
                                </div>
                                <div className="alert alert-danger">
                                The unit will turn off now.
                                </div>
                            </section>
                            
                        )}
                    </>
                )}
            </div>
            <button className="btn btn-primary" onClick={toggleLedOff} style={{ display: ledStatus === "1" ? 'block' : 'none' }}>
                Park the Unit
            </button>
        </div>
    );
});

export default ToggleLed; 