// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import { getOrders, createOrder, getInventory } from '../api/services';
import API from '../api/axios';
import { ShoppingCart, Plus, X, CheckCircle, Clock, Trash2, AlertCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New order form state matching backend schema
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    dueDate: '',
    items: [{ material: '', quantityUsed: 1 }],
    status: 'Pending',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, invRes] = await Promise.all([getOrders(), getInventory()]);
      const ordData = Array.isArray(ordRes.data) ? ordRes.data : (ordRes.data?.data || ordRes.data?.orders || []);
      const invData = Array.isArray(invRes.data) ? invRes.data : (invRes.data?.data || invRes.data?.items || []);
      
      setOrders(ordData);
      setInventory(invData);
      setError('');
    } catch (err) {
      setError('Failed to load orders from backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await createOrder(newOrder);
      setIsModalOpen(false);
      setNewOrder({ clientName: '', dueDate: '', items: [{ material: '', quantityUsed: 1 }], status: 'Pending' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order.');
      console.error(err);
    }
  };

  // Handle status update matching backend controller enums ['Pending', 'In Production', 'Completed', 'Cancelled']
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      fetchData();
      setError('');
    } catch (err) {
      try {
        await API.patch(`/orders/${orderId}`, { status: newStatus });
        fetchData();
        setError('');
      } catch (innerErr) {
        setError(innerErr.response?.data?.message || 'Failed to update order status.');
        console.error(innerErr);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete order.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Order Management</h1>
          <p className="text-sm text-gray-400">Track customer orders, fulfillment status, and raw material usage</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-sm transition shadow-lg shadow-blue-600/30"
        >
          <Plus size={18} /> Create New Order
        </button>
      </div>

      {error && (
        <div className="bg-red-500/25 border border-red-500 text-red-300 p-3 rounded mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No orders found. Click "Create New Order" to start.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 bg-gray-900/40">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Total Items</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const id = order._id || order.id;
                  const client = order.clientName || order.customerName || 'General Order';
                  return (
                    <tr key={id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                      <td className="py-3 px-4 font-mono text-xs text-blue-300">{id}</td>
                      <td className="py-3 px-4 font-medium">{client}</td>
                      <td className="py-3 px-4">{order.items ? order.items.length : 0}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : order.status === 'In Production'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {order.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {order.status !== 'In Production' && order.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(id, 'In Production')}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs transition border border-blue-500/30"
                          >
                            Produce
                          </button>
                        )}
                        {order.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(id, 'Completed')}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-2 py-1 rounded text-xs transition border border-green-500/30"
                          >
                            Complete
                          </button>
                        )}
                        {order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(id, 'Cancelled')}
                            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded text-xs transition border border-yellow-500/30"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-1.5 rounded text-xs transition inline-flex items-center border border-red-500/30"
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h2 className="text-xl font-bold text-blue-400">Create New Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newOrder.clientName}
                  onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newOrder.dueDate}
                  onChange={(e) => setNewOrder({ ...newOrder, dueDate: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Order Items</label>
                  <button
                    type="button"
                    onClick={() => setNewOrder({ ...newOrder, items: [...newOrder.items, { material: '', quantityUsed: 1 }] })}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    + Add Another Item
                  </button>
                </div>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      required
                      value={item.material}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[index].material = e.target.value;
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                    >
                      <option value="">Select Raw Material</option>
                      {inventory.map((inv) => (
                        <option key={inv._id || inv.id} value={inv._id || inv.id}>
                          {inv.materialName || inv.name} (Stock: {inv.stockQuantity})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantityUsed}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[index].quantityUsed = Number(e.target.value);
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="w-24 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Qty"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Initial Status</label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Production">In Production</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}