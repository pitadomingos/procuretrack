import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure upload directory

// Define POST route for uploading supplier data
router.post('/api/upload/suppliers', upload.single('file'), (req, res) => {
  console.log('Received file upload request for /api/upload/suppliers');
  // File details available in req.file
  // Other form fields in req.body
  res.status(200).send('Supplier file upload endpoint hit.');
});

// Define POST route for uploading purchase order data
router.post('/api/upload/purchase-orders', upload.single('file'), (req, res) => {
  console.log('Received file upload request for /api/upload/purchase-orders');
  // File details available in req.file
  // Other form fields in req.body
  res.status(200).send('Purchase order file upload endpoint hit.');
});

// Define POST route for uploading PO item data
router.post('/api/upload/po-items', upload.single('file'), (req, res) => {
  console.log('Received file upload request for /api/upload/po-items');
  // File details available in req.file
  // Other form fields in req.body
  res.status(200).send('PO item file upload endpoint hit.');
});

export default router;