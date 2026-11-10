const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const verifyToken = require('../middleware/auth'); 

// Protect all order routes with JWT verification middleware
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.post('/test', (req, res) => {
  res.send( 'Test route for orders' );
});
router.patch('/:id/status', verifyToken, updateOrderStatus);
module.exports = router;