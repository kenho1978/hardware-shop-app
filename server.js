const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./database');
const cloudinary = require('cloudinary').v2;

// Cloudinary config - Updated for image upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD || 'djpavkcx0',
  api_key: process.env.CLOUDINARY_KEY || '152924867596416',
  api_secret: process.env.CLOUDINARY_SECRET || 'AzmhvrVz-KpIxn68D6sO-RwjTjQ'
});

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Image upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { image } = req.body; // base64 image data
    
    const result = await cloudinary.uploader.upload(image, {
      folder: 'hardware-shop',
      transformation: [{ width: 800, crop: 'limit', quality: 'auto' }]
    });
    
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files with explicit MIME types
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Hardware Shop Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    ordersCount: database.getOrders().length,
    productsCount: database.getProducts().length
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(database.getProducts());
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = database.getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Get categories
app.get('/api/categories', (req, res) => {
  res.json(database.getCategories());
});

// Create order (with PayMe QR)
app.post('/api/orders', (req, res) => {
  const { items, customerName, customerPhone, customerEmail, shippingAddress } = req.body;
  
  // Calculate total
  const total = items.reduce((sum, item) => {
    const product = database.getProduct(item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
  
  // Generate order ID
  const orderId = 'ORD' + Date.now().toString().slice(-6);
  
  // Create order
  const order = {
    id: orderId,
    items,
    total,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    status: 'pending_payment', // pending_payment, paid, processing, delivered
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  database.createOrder(order);
  
  // Generate PayMe QR data
  // In production: Use your actual PayMe phone number
  const payMePhone = process.env.PAYME_PHONE || '91234567'; // Your PayMe phone
  const payMeQRData = {
    type: 'payme_qr',
    instructions: 'Scan with PayMe app to pay',
    amount: total,
    orderId: orderId,
    message: `Order ${orderId} - Hardware Shop`,
    // PayMe deep link format
    paymeLink: `payme.hsbc.com.hk/pay?p=${payMePhone}&am=${total}&m=Order${orderId}`,
    // Static QR code image (you'll upload your own)
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + 
                 encodeURIComponent(`payme.hsbc.com.hk/pay?p=${payMePhone}&am=${total}&m=Order${orderId}`)
  };
  
  res.json({
    success: true,
    order,
    payment: payMeQRData,
    instructions: [
      '1. Open PayMe app on your phone',
      '2. Tap "Scan QR Code"',
      `3. Scan the QR code above`,
      `4. Pay HK$${total.toFixed(2)}`,
      `5. Include "Order ${orderId}" in the message`,
      '6. We\'ll confirm your payment shortly'
    ]
  });
});

// Get order status
app.get('/api/orders/:id', (req, res) => {
  const order = database.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin: List all orders
app.get('/api/admin/orders', (req, res) => {
  res.json(database.getOrders());
});

// Admin: Update order status
app.put('/api/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = database.updateOrderStatus(req.params.id, status);
  
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  res.json({ success: true, order });
});

// Admin: Create product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  
  const product = {
    id: 'PRD' + Date.now().toString().slice(-6),
    name,
    description: description || '',
    price: parseFloat(price) || 0,
    category: category || 'General',
    stock: parseInt(stock) || 0,
    image: image || 'https://via.placeholder.com/150',
    rating: 4.5,
    createdAt: new Date().toISOString()
  };
  
  database.createProduct(product);
  res.json({ success: true, product });
});

// Admin: Update product
app.put('/api/products/:id', (req, res) => {
  const product = database.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, product });
});

// Admin: Delete product
app.delete('/api/products/:id', (req, res) => {
  const success = database.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Hardware Shop Backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛒 Products API: http://localhost:${PORT}/api/products`);
  console.log(`💳 PayMe QR orders: POST http://localhost:${PORT}/api/orders`);
  console.log(`👨‍💼 Admin orders: http://localhost:${PORT}/api/admin/orders`);
});