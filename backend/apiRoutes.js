import express from 'express';
import * as db from './db.js'; // Import the entire db module

const router = express.Router();

// Get All Suppliers
router.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM Supplier');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Error fetching suppliers' });
  }
});

// Get All Purchase Orders
router.get('/api/purchase-orders', async (req, res) => {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM PurchaseOrder');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Error fetching purchase orders' });
  }
});

// Get PO Items for a Specific Purchase Order
router.get('/api/purchase-orders/:poId/items', async (req, res) => {
  const poId = req.params.poId;
  try {
    const [rows] = await db.pool.execute('SELECT * FROM POItem WHERE poId = ?', [poId]);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching PO items for PO ID ${poId}:`, error);
    res.status(500).json({ error: 'Error fetching PO items' });
  }
});

// Get a Single Purchase Order by ID
router.get('/api/purchase-orders/:poId', async (req, res) => {
  const poId = req.params.poId;
  try {
    const [rows] = await db.pool.execute('SELECT * FROM PurchaseOrder WHERE id = ?', [poId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Purchase order not found' });
    }
  } catch (error) {
    console.error(`Error fetching purchase order with ID ${poId}:`, error);
    res.status(500).json({ error: 'Error fetching purchase order' });
  }
});


export default router;