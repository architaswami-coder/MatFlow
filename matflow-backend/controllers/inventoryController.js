const RawMaterial = require('../models/RawMaterial');

// Get all raw materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory', error: err.message });
  }
};

// Add a new raw material
exports.createMaterial = async (req, res) => {
  try {
    const { materialName, category, stockQuantity, unit, reorderLevel, unitPrice } = req.body;

    const newMaterial = new RawMaterial({
      materialName,
      category,
      stockQuantity,
      unit,
      reorderLevel,
      unitPrice
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json({ message: 'Raw material added successfully!', material: savedMaterial });
  } catch (err) {
    res.status(500).json({ message: 'Error adding raw material', error: err.message });
  }
};

// Update raw material stock/details
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMaterial = await RawMaterial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    res.status(200).json({ message: 'Raw material updated successfully', material: updatedMaterial });
  } catch (err) {
    res.status(500).json({ message: 'Error updating raw material', error: err.message });
  }
};

// Delete raw material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await RawMaterial.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    res.status(200).json({ message: 'Raw material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting raw material', error: err.message });
  }
};

// Get all inventory stock levels
exports.getInventory = async (req, res) => {
  try {
    const materials = await RawMaterial.find();
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory', error: err.message });
  }
};

// Restock or adjust material stock quantity
exports.updateStock = async (req, res) => {
  try {
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || stockQuantity < 0) {
      return res.status(400).json({ message: 'Valid non-negative stock quantity is required.' });
    }

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      { stockQuantity },
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Raw material not found.' });
    }

    res.status(200).json({
      message: 'Inventory stock updated successfully.',
      material: updatedMaterial
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory stock', error: err.message });
  }
};

// Get items running low on stock
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await RawMaterial.find({
      $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
    });
    
    res.status(200).json({
      count: lowStockItems.length,
      items: lowStockItems
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching low-stock items', error: err.message });
  }
};