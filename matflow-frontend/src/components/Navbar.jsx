// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-40 text-white shadow-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-blue-400 leading-tight">MatFlow</h1>
          <p className="text-xs text-gray-400">Enterprise ERP</p>
        </div>
      </div>

      {/* Navigation Links with Collapsible Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        {/* Clickable Main Menu Header */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-white transition"
        >
          <span>Main Menu</span>
          {isMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Collapsible Container */}
        {isMenuOpen && (
          <div className="space-y-2 pl-1 transition-all duration-300">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            <Link
              to="/inventory"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/inventory')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Package size={18} /> Inventory
            </Link>

            <Link
              to="/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/orders')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ShoppingCart size={18} /> Orders
            </Link>
          </div>
        )}
      </div>

      {/* Footer / Sign Out Section */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-red-500/20"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}