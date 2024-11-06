import React, { createContext, useState, useEffect } from 'react';
import api from '../../services/api';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await api.get('/admin'); // Endpoint to get current admin details
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};