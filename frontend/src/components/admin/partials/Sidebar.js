import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaExchangeAlt, FaCog, FaHome, FaBicycle, FaEnvelope, FaMoneyBill } from 'react-icons/fa';
import { GiPoliceBadge } from 'react-icons/gi';
import { useSidebar } from '../../common/SlidebarContext';

const Sidebar = forwardRef(({ response, ...props }, ref) => { // Added response as a prop
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // console.log('Response:', response); // Debugging line to check the response object

  return (
    <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={ref}>
      <div className="sidebar-header">
        <GiPoliceBadge className="logo" />
        <h2>WeTap Admin Panel</h2>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/admin/dashboard" onClick={toggleSidebar}><FaHome /> Dashboard</Link></li>
        <li><Link to="/admin/users" onClick={toggleSidebar}><FaUser /> Users</Link></li>
        <li><Link to="/admin/transactions" onClick={toggleSidebar}><FaExchangeAlt /> Ride Transactions</Link></li>
        <li><Link to="/admin/payments" onClick={toggleSidebar}><FaMoneyBill /> Payments</Link></li>
        <li><Link to="/admin/unit" onClick={toggleSidebar}><FaBicycle /> Units</Link></li>
        <li><Link to="/admin/notifications" onClick={toggleSidebar}><FaEnvelope /> System Notifications</Link></li>
        <li>
          {response && response._id ? (
            <Link to={`/admin/${response._id}`} onClick={toggleSidebar}>
              <FaCog /> Account Settings
            </Link>
          ) : (
            <span style={{display:'none'}}><FaCog /> Account Settings (Not Available)</span>
          )}
      </li>
      </ul>
    </nav>
  );
});

export default Sidebar;