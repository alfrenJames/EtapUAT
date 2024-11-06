import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { FaBars, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import EditPayment from './EditPayment'; // Component for editing payment
import PaymentDetails from './PaymentDetails'; // Component for viewing payment details
import { format, isValid, parseISO } from 'date-fns';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context

const PaymentTable = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const [payments, setPayments] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
        const response = await api.get('/payment'); // Fetch all payments
        console.log('Full API Response:', response); // Log the full response for debugging

        // Check the structure of the response
        if (response.data && Array.isArray(response.data.payments)) { // Access payments array
            setPayments(response.data.payments); // Set payments state to the payments array
        } else {
            throw new Error('Response does not contain a payments array');
        }
    } catch (error) {
        setError('Error fetching payments');
        console.error('Fetch Error:', error); // Log the error for debugging
    } finally {
        setLoading(false);
    }
};

  // Ensure payments is an array before filtering
  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    const matchesType = paymentTypeFilter === 'all' || payment.payment_type === paymentTypeFilter;
    const matchesSearch = payment.ref_number && payment.ref_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = payment.user_id.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        payment.user_id.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && (matchesSearch || matchesName);
  }) : []; // Default to an empty array if payments is not an array

  // Sort payments: "pending" first, then by date (newest first)
  const sortedPayments = filteredPayments.sort((a, b) => {
    const aDate = new Date(a.createdTime);
    const bDate = new Date(b.createdTime);
    
    // Check if payment statuses are "pending"
    if (a.payment_status === 'pending' && b.payment_status !== 'pending') {
      return -1; // a comes first
    }
    if (a.payment_status !== 'pending' && b.payment_status === 'pending') {
      return 1; // b comes first
    }
    // If both are the same status, sort by date
    return bDate - aDate; // Newest first
  });

  // Get current payments
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = sortedPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) return <div className="alert alert-danger">{error}</div>;

  const handleEdit = (payment) => {
    setEditingPayment(payment);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const closeDetailsModal = () => {
    setSelectedPayment(null);
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

  const handleUpdateStatus = async (payment) => {
    try {
      const response = await api.put(`/payment/pay/${payment._id}/status`, { status: 'completed' }); // Update status to completed
      fetchPayments(); // Refresh payment data after update
      alert(response.data.message); // Show success message
    } catch (error) {
      alert('Error updating payment status');
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar ref={sidebarRef} />

      <div className="container mt-5 d-inline">
        <header>
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>Payment List</h2>
          <Link to="/admin/create-payment" className="btn btn-success mx-2 mb-2" style={{ textDecoration: 'none', color: 'white' }}>
            ➕Add Payment
          </Link>
        </header>

        <div className="mb-3 mt-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by reference number, First and Last Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mb-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className="form-select"
            value={paymentTypeFilter}
            onChange={(e) => setPaymentTypeFilter(e.target.value)} // Handle payment type filter change
          >
            <option value="all">All Payment Types</option>
            <option value="topup">Topup</option>
            <option value="buy">Purchase Credit</option>
            {/* Add more payment types as needed */}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Reference Number</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Type</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">🤔Loading...</td>
                </tr>
              ) : currentPayments.length > 0 ? (
                currentPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.ref_number}</td>
                    <td>{payment.user_id.firstName} {payment.user_id.lastName}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.payment_status}</td>
                    <td>
                      {payment.payment_type === 'topup' ? <span><FaArrowUp /> TopUp</span> : payment.payment_type === 'buy' ? <span><FaArrowDown /> Buy</span> : null}
                    </td>
                    <td>{formatDate(payment.createdTime)}</td>
                    <td>
                      {payment.payment_status === 'pending' && ( // Show Edit button only if status is pending
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(payment)}>Edit</button>
                      )}
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(payment)}>View Details</button>
                      {payment.payment_status === 'pending' && ( // Show button only if status is pending
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(payment)}>Update Status</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          usersPerPage={paymentsPerPage}
          totalUsers={filteredPayments.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      {editingPayment && (
        <EditPayment
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onUpdate={fetchPayments} // Refresh payment data after update
        />
      )}

      {selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
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

export default PaymentTable;