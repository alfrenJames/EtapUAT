import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const CreateUnitModal = ({ isOpen, onRequestClose, onCreate, existingUnits }) => {
  const [newUnit, setNewUnit] = useState({ unit_number: '', availability: false, condition: 'offline' });

  useEffect(() => {
    // Automatically set the next unit number based on existing units
    if (existingUnits.length > 0) {
      const lastUnitNumber = existingUnits[existingUnits.length - 1].unit_number; // Get the last unit number
      const nextUnitNumber = (parseInt(lastUnitNumber, 10) + 1).toString().padStart(3, '0'); // Increment and format
      setNewUnit((prev) => ({ ...prev, unit_number: nextUnitNumber })); // Set the new unit number
    }
  }, [existingUnits]);

  const handleCreateUnit = () => {
    if (!newUnit.unit_number) {
      alert('Unit number is required'); // Simple validation
      return;
    }
    onCreate(newUnit); // Call the onCreate prop with the new unit data
    setNewUnit({ unit_number: '', availability: false, condition: 'offline' }); // Reset the form
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <button type="button" className="btn-close" onClick={onRequestClose}></button>
      <h2>Create Unit</h2>
      <input
        type="text"
        placeholder="Unit Number"
        value={newUnit.unit_number}
        readOnly // Make the input read-only since it's auto-generated
      />
      <select
        value={newUnit.condition}
        onChange={(e) => setNewUnit({ ...newUnit, condition: e.target.value })}
      >
        <option value="offline">Offline</option>
        <option value="damaged">Damaged</option>
        <option value="online" disabled>Online</option> {/* Online is disabled */}
      </select>
      <button onClick={handleCreateUnit} className='btn btn-primary'>Create</button>
      <button onClick={onRequestClose} className='btn btn-danger'>Cancel</button>
    </Modal>
  );
};

export default CreateUnitModal;