// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';

function ProtectedContent() {
  const location = useLocation();
  
  // Get current page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/inventory': return 'Inventory Catalog';
      case '/orders': return 'Order Management';
      default: return 'MatFlow ERP';
    }
  };

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-900 flex flex-col">
      {/* Top Brand / Header Bar */}
      <header className="bg-gray-950/60 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            MatFlow ERP
          </span>
          <span className="text-gray-500">/</span>
          <h2 className="text-sm font-medium text-gray-200">{getPageTitle()}</h2>
        </div>
        <div className="text-xs text-gray-400">
          Status: <span className="text-green-400 font-semibold">● Live System</span>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedLayout() {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Navbar />
      <ProtectedContent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}