import React, { useState, useEffect} from 'react';
import api from '../../../services/api';
import './css/unit.css';

const EditUnitModal = ({unit, onClose, onUpdate }) => {

  const [formData, setFormData] = useState({
    unit_number: "",
    availability: null,
    last_parking_route: "",
    condition:"",
    idUrl: ''  // Added idUrl to the form data
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_number: unit.unit_number,
        availability: unit.availability,
        last_parking_route: unit.last_parking_route,
        condition: unit.condition,
        idUrl: unit.idUrl  // Set idUrl from user data
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/units/${unit._id}`, formData);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating units:', error);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-content">
        <h2>Edit Unit</h2>
        Unit Number:
        <input
          type="text"
          name="unit_number"
          id='unit_number'
          className='form-control'
          value={formData.unit_number}
          onChange={handleChange}
          placeholder="Unit Number"
          required
        />
        <select
          name="availability"
          id='availability'
          className='form-control'
          value={formData.availability}
          onChange={handleChange}
        >
          <option value={true}>Available</option>
          <option value={false}>Unavailable</option>
        </select>
        <select
          name="last_parking_route"
          id='last_parking_route'
          className='form-control'
          value={formData.last_parking_route}
          onChange={handleChange}
        >
          <option value={'Route 01'}>Route 1 - Gate 1</option>
          <option value={'Route 02'}>Route 2 - Hotel 1</option>
          <option value={'Route 03'}>Route 3 - Hotel 2</option>
          <option value={'Route 04'}>Route 4 - Hotel 3</option>
          <option value={'Route 05'}>Route 5 - Hotel 4</option>
          <option value={'Route 06'}>Route 6 - MAB Entrance 1</option>
          <option value={'Route 07'}>Route 7 - MAB Entrance 2</option>
          <option value={'Route 08'}>Route 8 - Acounting</option>
          <option value={'Route 09'}>Route 9 - Arnaiz Building</option>
          <option value={'Route 10'}>Route 10 - Gate 2</option>
          <option value={'Route 11'}>Route 11 - Gym</option>
        </select>
        <select
          name="condition"
          id='condition'
          className='form-control'
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="online" disabled>Online</option>
          <option value="offline">Offline</option>
          <option value="damaged">Damaged</option>
        </select>
        <button onClick={handleSubmit} className='btn btn-primary'>Save</button>
        <button onClick={onClose} className='btn btn-danger'>Cancel</button>
      </div>
    </div>
  );
};

export default EditUnitModal;