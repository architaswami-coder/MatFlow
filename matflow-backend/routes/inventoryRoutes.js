const express = require('express');
const router = express.Router();
const { 
  getAllMaterials, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial 
} = require('../controllers/inventoryController');
const { getInventory, updateStock, getLowStockItems } = require('../controllers/inventoryController');
const verifyToken = require('../middleware/auth');

// All inventory routes are protected with verifyToken
router.get('/', verifyToken, getAllMaterials);
router.post('/', verifyToken, createMaterial);
router.put('/:id', verifyToken, updateMaterial);
router.delete('/:id', verifyToken, deleteMaterial);

// Get all inventory items
router.get('/', verifyToken, getInventory);
// Restock/Update specific material stock
router.patch('/:id/stock', verifyToken, updateStock);

// GET low stock alerts
router.get('/low-stock', verifyToken, getLowStockItems);

module.exports = router;