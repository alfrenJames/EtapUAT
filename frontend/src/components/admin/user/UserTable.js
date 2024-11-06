import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import './css/userTable.css';
import '../../admin/css/adminDashboard.css'
import { FaBars, FaTimes} from 'react-icons/fa';
import EditUser from './EditUser';
import { format, isValid, parseISO } from 'date-fns';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context
import UserDetails from './UserDetails';
import BuyCreditsModal from './BuyCreditModal';
import PaymentCreditModal from './PaymentCreditModal';


const UserTable = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);// Get sidebar state
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user 
  const [updateCredit, setUpdateCredit] = useState(null);
  const [paymentCredit, setPaymentCredit] = useState(null);
  
  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  const refreshData = () => {
    fetchUsers();
  };

  const handleDeactivate = async (userId) => {
    try {
      await api.put(`/users/${userId}/deactivate`);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'inactive' } : user
      ));
    } catch (error) {
      setError('Error deactivating user');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await api.put(`/users/${userId}/activate`);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ));
    } catch (error) {
      setError('Error activating user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) return <div className="alert alert-danger">{error}</div>;

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateCredit = (user) => {
    setUpdateCredit(user);
  };

  const handleUpdatePayment = (user) => {
    setPaymentCredit(user); // Open payment modal for the selected user
    console.log('Payment Credit User:', user);
};
  const handleUpdate = (updatedUser) => {
    setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      console.error(`Invalid date: ${dateString}`);
      return 'Invalid Date';
    }
    
    return format(date, 'MM/dd/yyyy');
  };

  const handleViewDetails = (users) => {
    setSelectedUser(users); // Set the selected user for details
  };

  const closeDetailsModal = () => {
    setSelectedUser(null); // Close the modal
  };

  
  return (
    
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar ref={sidebarRef} />


      <div className="container mt-5 d-inline">
        <header>
        <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2>User List</h2>
        <Link to="/admin/create-user" className="btn btn-success mx-2 mb-2" style={{ textDecoration: 'none', color: 'white' }}>
          ➕Add User
        </Link>
        </header>
        
        <div className="mb-3 mt-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Section</th>
                <th>Credit Amount</th>
                <th>Credit Ride</th>
                <th>Add Credits</th>
                <th>Date Registered</th>
                <th>ID Picture</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? ( // Check if loading
                <tr>
                  <td colSpan="10" className="text-center">
                   🤔Loading... 
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{`${user.lastName}, ${user.firstName}`}</td>
                    <td>{user.emailAddress}</td>
                    <td>{user.course}</td>
                    <td>{user.section}</td>
                    <td>{user.creditAmount}</td>
                    <td>{user.creditRide}</td>
                    <td>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleUpdateCredit(user)} // Open modal on click
                        disabled={user.status === 'inactive'}
                      >
                        💳BUY
                      </button>

          
                      <button 
                          className="btn btn-success btn-sm my-2"
                          onClick={() => handleUpdatePayment(user)} // Open payment modal on click
                          disabled={user.status === 'inactive'}
                      >
                        <img src='https://brandlogos.net/wp-content/uploads/2024/01/gcash-logo_brandlogos.net_kiaqh-768x641.png' style={{width: '2rem', height: 'auto'}}/>
                      </button>
              
                    </td>
                    <td>{formatDate(user.createdTime)}</td>
                    <td className="id-image-container">
                      <img 
                        src={user.idUrl} 
                        alt="ID Picture" 
                        className="id-image"
                        onMouseEnter={() => setHoveredImage(user.idUrl)}
                        onMouseLeave={() => setHoveredImage(null)}
                      />
                      {hoveredImage === user.idUrl && (
                        <div className="id-image-modal">
                          <img src={user.idUrl} alt={`ID Picture ${user._id}`} />
                        </div>
                      )}
                    </td>
                    <td>{user.status}</td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewDetails(user)}
                      >
                        View Details
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeactivate(user._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleActivate(user._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No users found.</td>
                </tr>
              )}
            </tbody>
            {updateCredit &&(
              <BuyCreditsModal
                user={updateCredit}
                onClose={() => setUpdateCredit(null)}
                onUpdate={handleUpdate}
                refreshData={refreshData}
              /> 
            )}
            {editingUser && (
              <EditUser
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onUpdate={handleUpdate}
              />
            )}

            {paymentCredit && (
                <PaymentCreditModal
                    user={paymentCredit}
                    onClose={() => setPaymentCredit(null)} // Ensure this closes the modal
                    onUpdate={refreshData} // Refresh user data after payment
                />
            )}
          </table>
        </div>
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={filteredUsers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserTable;