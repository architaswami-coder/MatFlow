// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInventory, getLowStockItems, getOrders } from '../api/services';
import { Package, AlertTriangle, ShoppingCart, LogOut, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalInventory: 0,
    lowStockCount: 0,
    totalOrders: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [invRes, lowRes, ordRes] = await Promise.all([
        getInventory(),
        getLowStockItems(),
        getOrders(),
      ]);

      // Safely extract arrays whether data comes as an array or nested object
      const invData = Array.isArray(invRes.data) ? invRes.data : (invRes.data?.data || invRes.data?.items || []);
      const lowData = Array.isArray(lowRes.data) ? lowRes.data : (lowRes.data?.data || lowRes.data?.items || []);
      const ordData = Array.isArray(ordRes.data) ? ordRes.data : (ordRes.data?.data || ordRes.data?.orders || []);

      setStats({
        totalInventory: invData.length,
        lowStockCount: lowData.length,
        totalOrders: ordData.length,
      });

      setLowStockItems(lowData);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard metrics from backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">MatFlow ERP Dashboard</h1>
          <p className="text-sm text-gray-400">Inventory & Order Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm transition"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Inventory */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Inventory Items</p>
            <h3 className="text-3xl font-bold mt-1 text-white">{stats.totalInventory}</h3>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
            <Package size={28} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Low Stock Alerts</p>
            <h3 className="text-3xl font-bold mt-1 text-yellow-400">{stats.lowStockCount}</h3>
          </div>
          <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg">
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">Total Orders Processed</p>
            <h3 className="text-3xl font-bold mt-1 text-green-400">{stats.totalOrders}</h3>
          </div>
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
            <ShoppingCart size={28} />
          </div>
        </div>
      </div>

      {/* Low Stock Watchlist Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
          <AlertTriangle size={20} /> Low Stock Watchlist
        </h2>
        {lowStockItems.length === 0 ? (
          <p className="text-gray-400 text-sm">All inventory levels are healthy! No items require restocking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item._id || item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 font-medium">{item.name || item.title || item.productName || item.itemName || 'Unnamed Item'}</td>
                    <td className="py-3 px-4 text-gray-400">{item.sku || 'N/A'}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{item.stockQuantity}</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}