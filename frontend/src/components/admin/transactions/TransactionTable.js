import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import '../../admin/css/adminDashboard.css';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context
import { FaBars, FaTimes } from 'react-icons/fa';
import CreateTransactionModal from './CreateTransactionModal';
import { ref, onValue } from 'firebase/database'; // Import ref and get from firebase/database
import { database } from '../../../services/firebase'; // Import the database instance

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [ledStatus, setLedStatus] = useState('0'); // State to hold LED status
  const [unitSearchTerm, setUnitSearchTerm] = useState('');

  const fetchLedStatus = () => {
    const ledRef = ref(database, 'Led1Status'); // Reference to the LED status in Firebase
    onValue(ledRef, (snapshot) => {
      const status = snapshot.val();
      setLedStatus(status); // Update state with the fetched status
    });
  };

  useEffect(() => {
    fetchTransactions();
    fetchLedStatus(); // Fetch LED status on component mount
  }, []);


const fetchTransactions = async () => {
    try {
      const response = await api.get('/transaction');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error fetching transactions:');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  const refreshData = () => {
    fetchTransactions();
  };
 
  // Filter transactions based on search term
  // Filter transactions based on search terms
  const filteredTransactions = transactions.filter(transaction => {
    const userName = `${transaction.user_id.firstName} ${transaction.user_id.lastName}`.toLowerCase();
    const unitNumber = transaction.unit_number.unit_number.toString().toLowerCase();
    return userName.includes(searchTerm.toLowerCase()) && unitNumber.includes(unitSearchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.created_time) - new Date(a.created_time)); // Sort by created time (new to old)

  // Get current transactions for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar ref={sidebarRef} />
        <div className="container mt-5">
        <header>
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>Transaction List</h2>
          <button className="btn btn-primary ml-2" onClick={handleOpenModal} disabled={ledStatus === '1'}>
            Create Transaction
          </button>
        </header>
        <CreateTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        refreshData={refreshData} 
        />
         <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by unit number"
          value={unitSearchTerm}
          onChange={(e) => setUnitSearchTerm(e.target.value)}
        />
        <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by user name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <div className="mb-3">
          <strong>Total Transactions: {filteredTransactions.length}</strong>
        </div>    
      {loading ? (
        <div className="text-center">🤔Loading...</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Transaction Number</th>
              <th>User</th>
              <th>Unit Number</th>
              <th>Start Parking</th>
              <th>Last Parking</th>
              <th>Transaction Ride Credit</th>
              <th>Previous Ride Credit</th>
              <th>Created By</th>
              <th>Created Time</th>
            </tr>
          </thead>
          <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td>{indexOfFirstTransaction + index + 1}</td>
                    <td>{transaction.user_id.firstName} {transaction.user_id.lastName}</td>
                    <td>{transaction.unit_number.unit_number}</td>
                    <td>{transaction.start_park}</td>
                    <td>{transaction.end_park}</td>
                    <td>{transaction.credit_ride - 1}</td>
                    <td>{transaction.credit_ride}</td>
                    <td>{transaction.created_by_model}</td>
                    <td>{transaction.created_time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No transactions found.</td>
                </tr>
              )}
            </tbody>
        </table>
      )}
      <Pagination
          transactionsPerPage={transactionsPerPage}
          totalTransactions={filteredTransactions.length}
          paginate={paginate}
          currentPage={currentPage}
        />
    </div>
    </div>
  );
};
const Pagination = ({ transactionsPerPage, totalTransactions, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
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
export default TransactionTable;