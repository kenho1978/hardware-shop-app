const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize database
let db = {
  products: [
    {
      id: '1',
      name: 'Hammer',
      description: '16oz Claw Hammer',
      price: 89.90,
      category: 'Tools',
      image: 'https://via.placeholder.com/150',
      stock: 45,
      rating: 4.5
    },
    {
      id: '2',
      name: 'Screwdriver Set',
      description: '10-piece precision screwdriver set',
      price: 129.90,
      category: 'Tools',
      image: 'https://via.placeholder.com/150',
      stock: 32,
      rating: 4.2
    },
    {
      id: '3',
      name: 'Paint Brush',
      description: '2-inch angled paint brush',
      price: 39.90,
      category: 'Painting',
      image: 'https://via.placeholder.com/150',
      stock: 78,
      rating: 4.0
    },
    {
      id: '4',
      name: 'Electrical Tape',
      description: 'Black vinyl electrical tape',
      price: 25.50,
      category: 'Electrical',
      image: 'https://via.placeholder.com/150',
      stock: 120,
      rating: 4.3
    },
    {
      id: '5',
      name: 'Pipe Wrench',
      description: '14-inch adjustable pipe wrench',
      price: 189.90,
      category: 'Plumbing',
      image: 'https://via.placeholder.com/150',
      stock: 18,
      rating: 4.7
    }
  ],
  orders: [],
  categories: [
    { id: 'tools', name: 'Tools', icon: '🔧', count: 2 },
    { id: 'plumbing', name: 'Plumbing', icon: '🚰', count: 1 },
    { id: 'electrical', name: 'Electrical', icon: '💡', count: 1 },
    { id: 'painting', name: 'Painting', icon: '🎨', count: 1 }
  ]
};

// Load database from file if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    db = JSON.parse(data);
    console.log('📁 Database loaded from file');
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Auto-save every 30 seconds
setInterval(saveDatabase, 30000);

// Save on exit
process.on('SIGINT', () => {
  saveDatabase();
  process.exit(0);
});

// Database methods
const database = {
  // Products
  getProducts: () => db.products,
  getProduct: (id) => db.products.find(p => p.id == id),
  
  createProduct: (product) => {
    db.products.push(product);
    saveDatabase();
    return product;
  },
  
  updateProduct: (id, updates) => {
    const index = db.products.findIndex(p => p.id == id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updates };
      saveDatabase();
      return db.products[index];
    }
    return null;
  },
  
  deleteProduct: (id) => {
    const index = db.products.findIndex(p => p.id == id);
    if (index !== -1) {
      db.products.splice(index, 1);
      saveDatabase();
      return true;
    }
    return false;
  },
  
  // Categories
  getCategories: () => db.categories,
  
  // Orders
  getOrders: () => db.orders,
  getOrder: (id) => db.orders.find(o => o.id === id),
  createOrder: (order) => {
    db.orders.push(order);
    saveDatabase();
    return order;
  },
  updateOrderStatus: (id, status) => {
    const order = db.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      saveDatabase();
      return order;
    }
    return null;
  }
};

module.exports = database;