// ... existing imports ...
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import '../../admin/css/adminDashboard.css';
import Sidebar from '../partials/Sidebar'; // Import the Sidebar
import { useSidebar } from '../../common/SlidebarContext'; // Import the Sidebar context
import { FaBars, FaTimes } from 'react-icons/fa';
import CreateUnitModal from './CreateUnitModal';
import EditUnitModal from './EditUnitModal';

const UnitTable = () => {
    const [units, setUnits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [conditionFilter, setConditionFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
    const { sidebarOpen, toggleSidebar } = useSidebar();
    const sidebarRef = useRef(null);
    // const mainContentRef = useRef(null); // Get sidebar state
    const [editingUnit, setEditingUnit] = useState(null); // State for the unit being edited
  
    useEffect(() => {
      fetchUnits();
    }, []);
  
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const response = await api.get('/units'); // Adjust the endpoint as necessary
        setUnits(response.data);
      } catch (error) {
        setError('Error fetching units');
      } finally {
        setLoading(false);
      }
    };
  
    const handleCreateUnit = async (newUnit) => { // Function to handle unit creation
      try {
        await api.post('/units', newUnit); // Adjust the endpoint as necessary
        fetchUnits(); // Refresh the unit list
        setModalIsOpen(false); // Close the modal
      } catch (error) {
        setError('Error creating unit');
      }
    };
  
    const filteredUnits = units.filter(unit => {
      const matchesUnitNumber = unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && unit.availability) || 
        (availabilityFilter === 'unavailable' && !unit.availability);
      const matchesCondition = conditionFilter === 'all' || unit.condition === conditionFilter;
  
      return matchesUnitNumber && matchesAvailability && matchesCondition;
    });

    const handleEditUnit = (unit) => {
      setEditingUnit(unit);
      console.log(unit);
    };
  
    const handleUpdateUnit = (updatedUnit) => {
      setUnits(units.map(unit => unit._id === updatedUnit._id ? updatedUnit : unit));
    };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar ref={sidebarRef} />
      <div className="container mt-5">
        
        <header>
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>Unit List</h2>
          <button className="btn btn-primary" onClick={() => setModalIsOpen(true)}>Create Unit</button> {/* Button to open modal */}
        </header>
        <CreateUnitModal 
          isOpen={modalIsOpen} 
          onRequestClose={() => setModalIsOpen(false)} 
          onCreate={handleCreateUnit} 
          existingUnits={units} // Pass existing units to the modal
        />
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by unit number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mb-2"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            className="form-select mb-2"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="all">All Conditions</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Unit Number</th>
              <th>Availability</th>
              <th>Last Parking Route</th>
              <th>Condition</th>
              <th>Created By</th>
              <th>Created Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center alert alert-danger">{error}</td>
              </tr>
            ) : filteredUnits.length > 0 ? (
              filteredUnits.map((unit, index) => (
                <tr key={unit._id}>
                  <td>{unit.unit_number}</td>
                  <td>{unit.availability ? 'Available' : 'Unavailable'}</td>
                  <td>{unit.last_parking_route}</td>
                  <td>{unit.condition}</td>
                  <td>{unit.createdBy.username}</td> {/* Display the username */}
                  <td>{new Date(unit.createdTime).toLocaleString()}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditUnit(unit)}
                      disabled={index === 0} // Disable button for the first unit
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No units found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingUnit && (
        <EditUnitModal
          unit={editingUnit}
          onClose={() => setEditingUnit(null)}
          onUpdate={handleUpdateUnit}
        />
      )}
    </div>
  );
};

export default UnitTable;