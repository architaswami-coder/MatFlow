// src/pages/Inventory.jsx
import React, { useEffect, useState } from 'react';
import { getInventory, createInventoryItem, updateStock } from '../api/services';
import { Package, Plus, AlertTriangle, ArrowUpDown, X } from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockChange, setStockChange] = useState(0);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    stockQuantity: 0,
    unitPrice: 0,
    category: '',
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.items || []);
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load inventory list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await createInventoryItem(newItem);
      setIsAddModalOpen(false);
      setNewItem({ name: '', sku: '', stockQuantity: 0, unitPrice: 0, category: '' });
      fetchInventory();
    } catch (err) {
      setError('Failed to create inventory item.');
      console.error(err);
    }
  };

  const handleUpdateStockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await updateStock(selectedItem._id || selectedItem.id, { stockQuantity: Number(stockChange) });
      setIsStockModalOpen(false);
      setSelectedItem(null);
      setStockChange(0);
      fetchInventory();
    } catch (err) {
      setError('Failed to update stock quantity.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Inventory Management</h1>
          <p className="text-sm text-gray-400">Manage stock items, quantities, and pricing</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-sm transition"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading inventory items...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No inventory items found. Click "Add New Item" to start.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4">Unit Price (Rs.)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id || item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 font-medium">{item.name || item.title || item.productName || item.itemName || 'Unnamed Item'}</td>
                    <td className="py-3 px-4 text-gray-400">{item.sku || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-300">{item.category || 'General'}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${item.stockQuantity <= 5 ? 'text-yellow-400' : 'text-white'}`}>
                        {item.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">Rs.{item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setStockChange(item.stockQuantity);
                          setIsStockModalOpen(true);
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-blue-300 px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 transition"
                      >
                        <ArrowUpDown size={14} /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-400">Add New Inventory Item</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Steel Rod 10mm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">SKU</label>
                <input
                  type="text"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g., STL-RD-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newItem.stockQuantity}
                    onChange={(e) => setNewItem({ ...newItem, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Unit Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Raw Materials"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isStockModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-yellow-400">Adjust Stock</h2>
              <button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Updating stock for: <span className="font-semibold text-white">{selectedItem.name || selectedItem.title}</span>
            </p>
            <form onSubmit={handleUpdateStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">New Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stockChange}
                  onChange={(e) => setStockChange(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm font-semibold text-black transition"
                >
                  Update Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}