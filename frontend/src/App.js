import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SidebarProvider } from './components/common/SlidebarContext';
import AdminLogin from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import Users from './components/admin/user/UserTable';
import CreateUser from './components/admin/user/CreateUser';
import UnitTable from './components/admin/units/UnitTable';
import Account from './components/admin/Account';
import TransactionList from './components/admin/transactions/TransactionTable';
import PaymentTable from './components/admin/payments/PaymentTable';
import NotificationTable from './components/admin/notifications/NotificationTable';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-user" 
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/unit" 
            element={
              <ProtectedRoute>
                <UnitTable />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/:id" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/admin/transactions" 
            element={
              <ProtectedRoute>
                <TransactionList />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute>
                <PaymentTable />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute>
                <NotificationTable />
              </ProtectedRoute>
            } 
          />
          
        
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;