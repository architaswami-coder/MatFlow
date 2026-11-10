const Order = require('../models/Order');
const RawMaterial = require('../models/RawMaterial');

// Create a new order & deduct inventory stock
exports.createOrder = async (req, res) => {
  try {
    const { items, clientName, dueDate } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided in the order.' });
    }

    if (!clientName || !dueDate) {
      return res.status(400).json({ message: 'Client name and due date are required.' });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (let item of items) {
      const materialDoc = await RawMaterial.findById(item.material);
      if (!materialDoc) {
        return res.status(404).json({ message: `Raw material not found: ${item.material}` });
      }

      // Safely ensure stockQuantity is parsed as a number (prevents NaN errors)
      const currentStock = Number(materialDoc.stockQuantity) || 0;

      // Check if enough stock is available
      if (currentStock < item.quantityUsed) {
        return res.status(400).json({
          message: `Insufficient stock for ${materialDoc.materialName}. Available: ${currentStock}, Requested: ${item.quantityUsed}`
        });
      }

      const itemTotal = materialDoc.unitPrice * item.quantityUsed;
      totalAmount += itemTotal;

      processedItems.push({
        material: item.material,
        quantityUsed: item.quantityUsed,
        unitPrice: materialDoc.unitPrice,
      });

      // Deduct the ordered quantity from inventory stock safely
      materialDoc.stockQuantity = currentStock - item.quantityUsed;
      await materialDoc.save();
    }

    const newOrder = new Order({
      user: req.user.id, // Populated by your verifyToken middleware
      clientName,
      dueDate,
      items: processedItems,
      totalAmount,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: 'Order created successfully and inventory updated.',
      order: savedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.material', 'materialName category unit');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};

// Update order status & restore inventory if cancelled
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'In Production', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // If changing to 'Cancelled' from any other status, restore inventory stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const materialDoc = await RawMaterial.findById(item.material);
        if (materialDoc) {
          const currentStock = Number(materialDoc.stockQuantity) || 0;
          materialDoc.stockQuantity = currentStock + item.quantityUsed;
          await materialDoc.save();
        }
      }
    }

    // Update the status
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: `Order status updated to ${status} successfully.`,
      order: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};