import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database'; // Import ref and get from firebase/database
import { database } from '../../services/firebase'; // Import the database instance
import { FaBell } from 'react-icons/fa';
import Sidebar from './partials/Sidebar';
import { useSidebar } from '../common/SlidebarContext';
import './css/adminDashboard.css';
import api from '../../services/api';
import AdminHeader from './partials/AdminHeader';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [userCounts, setUserCounts] = useState({
    active: 0,
    inactive: 0,
    suspended: 0
  });
  const [adminName, setAdminName] = useState('Admin');
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const [unitStatus, setUnitStatus] = useState(null); // Add state for unit status
  const [activeRoute, setActiveRoute] = useState(null);
  const [lastParkingRoute, setLastParkingRoute] = useState(null);
  const [countdown, setCountdown] = useState(310); // Initialize countdown (5 minutes and 10 seconds)
  const [statusMessage, setStatusMessage] = useState(''); // Add state for status message
  const [totalTransactions, setTotalTransactions] = useState(0); // State for total transactions
  const [completedTransactions, setCompletedTransactions] = useState(0); // State for completed transactions
  const [pendingTransactions, setPendingTransactions] = useState(0); // State for pending transactions

  useEffect(() => {
    let timer;
    if (unitStatus === '1' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setStatusMessage('Updating status of Unit...'); // Set status message when countdown reaches zero
      setCountdown(310); // Reset countdown if it reaches zero
    }

    return () => clearInterval(timer); // Clean up the timer on component unmount or when unitStatus changes
  }, [unitStatus, countdown]);


  useEffect(() => {
    fetchUserCounts();
    fetchAdminName();
    fetchUnitStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen &&
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          mainContentRef.current && 
          mainContentRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, toggleSidebar]);

  const fetchUserCounts = async () => {
    try {
      const response = await api.get('/users/counts');
      setUserCounts(response.data);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const fetchAdminName = () => {
    const storedUsername = localStorage.getItem('username'); // Get username from localStorage
    if (storedUsername) {
      setAdminName(storedUsername); // Set admin name from localStorage
    }
  };

  const fetchUnitStatus = () => {
    const unitStatusRef = ref(database, 'Led1Status'); // Create a reference to the database path
    const unsubscribe = onValue(unitStatusRef, (snapshot) => { // Set up a listener
      if (snapshot.exists()) {
        setUnitStatus(snapshot.val()); // Set the unit status
      } else {
        setUnitStatus('offline'); // Handle case where data does not exist
      }
    }, (error) => {
      console.error('Error fetching unit status:', error);
      setUnitStatus('offline');
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const unitsResponse = await api.get('/units'); // Fetch all units
        const units = unitsResponse.data; // Access the list of units
        if (units.length > 0) {
          const firstUnitId = units[0]._id; // Get the first unit's _id
          const response = await api.get(`/units/${firstUnitId}`); // Fetch data for the first unit
          const unitData = response.data; // Access the data from the response
          const lastParkingRoute = unitData.last_parking_route; // Access the last_parking_route value
          console.log('Last Parking Route:', lastParkingRoute); // Log or set state as needed
          setLastParkingRoute(lastParkingRoute);
        } else {
          console.warn('No units found');
        }
      } catch (error) {
        console.error("Error fetching unit data:", error);
      }
    };

    fetchUnitData(); 

    // Set active route based on lastParkingRoute
    if (lastParkingRoute) {
      const routeIndex = parseInt(lastParkingRoute.split('Route ')[1]) - 1; // Extract index from lastParkingRoute
      if (!isNaN(routeIndex) && routeIndex >= 0 && routeIndex < 11) { // Ensure index is valid
        setActiveRoute(routeIndex); // Set active route based on lastParkingRoute
      }
    }
  }, [lastParkingRoute]);

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

  useEffect(() => {
    fetchTransactionCounts(); // Fetch transaction counts on component mount
  }, []);

  const fetchTransactionCounts = async () => {
    try {
      const response = await api.get('/payment'); // Fetch transaction counts from API
      setTotalTransactions(response.data.total); // Set total transactions
      setCompletedTransactions(response.data.completed); // Set completed transactions
      setPendingTransactions(response.data.pending); // Set pending transactions
    } catch (error) {
      console.error('Error fetching transaction counts:', error);
    }
  };
  
  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar ref={sidebarRef} />

      <main className="main-content" ref={mainContentRef}>
        <AdminHeader adminName={adminName} onLogout={handleLogout} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stat-card">
              <h3 className='d-inline'>
                <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                  👤Users Monitoring
                </Link>
              </h3>
              {userCounts.inactive > 0 && (
                <div className="notification d-inline">
                  <FaBell /> {userCounts.inactive} inactive user(s)
                </div>
              )}
              <section className='d-flex justify-content-around'>
                <p>Active: {userCounts.active}</p>
                <p>Inactive: {userCounts.inactive}</p>
                <p>Suspended: {userCounts.suspended}</p>
              </section>
            </div>

          
            <div className="stat-card">
              <h3 className='d-inline'>🧾Transactions</h3>
              <div className="transaction-summary">
                <p>Total Payment Transactions: {totalTransactions}</p> {/* Display total transactions */}
                <p>Completed Payment Transactions: {completedTransactions}</p> {/* Display completed transactions */}
                <p>Pending Payment Transactions: {pendingTransactions}</p> {/* Display pending transactions */}
              </div>
            </div>

          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <h3 className='d-inline'>🛵Unit Monitoring</h3>
              {unitStatus === "0" && (
                <div className="unit-status">
                  🟢 Unit 001 is avialable
                  </div>
              )}
              {unitStatus === "1" && (
                <div className="unit-status">
                  🔴 Unit 001 is not available
                  <div className="countdown">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} {/* Display countdown */}
                  </div>
                  {countdown === 0 && <div className="status-message">{statusMessage}</div>} {/* Display status message */}
                </div>
                
              )}
              {unitStatus !== "0" && unitStatus !== "1" && (
                <div className="unit-status">Unit is offline or unreachable</div>
              )}
            </div>

            <div className="stat-card">
              <h3 className='d-inline'>📧 Notifications</h3>
            </div>
           </div>

           <div className="routes-section">
            <h2>Last Parking: {lastParkingRoute !== null ? lastParkingRoute : 'Loading...'}</h2>
            <ul className="list-inline">
              {Array.from({ length: 11 }, (_, index) => index + 1).map((route) => ( // Generate routes dynamically
                <li 
                  key={route} 
                  className={`list-inline-item col-sm-0 ${activeRoute === route - 1 ? 'active-route' : ''}`} // Adjust for zero-based index
                  
                >
                  <div className="route-label">{route}</div>
                  <div className="tooltip">{routeDescriptions[route - 1]}</div> {/* Display corresponding tooltip */}
                </li>
              ))}
            </ul>
          </div>
      
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;