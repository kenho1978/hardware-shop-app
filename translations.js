// Bilingual translations for Hardware Shop
const translations = {
  en: {
    // App
    appTitle: 'Hardware Shop',
    welcome: 'Welcome to Hardware Shop',
    
    // Navigation
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    orders: 'Orders',
    profile: 'Profile',
    
    // Categories
    all: 'All',
    tools: 'Tools',
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    painting: 'Painting',
    hardware: 'Hardware',
    safety: 'Safety',
    
    // Product
    addToCart: 'Add to Cart',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    onlyLeft: 'Only {{count}} left',
    rating: 'Rating',
    reviews: 'reviews',
    
    // Cart
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    itemsInCart: '{{count}} items in cart',
    itemInCart: '{{count}} item in cart',
    quantity: 'Quantity',
    remove: 'Remove',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Checkout',
    
    // Checkout
    checkoutWithPayMe: 'Checkout with PayMe',
    shippingAddress: 'Shipping Address',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    
    // PayMe
    payWithPayMe: 'Pay with PayMe',
    scanQRCode: 'Scan QR Code',
    includeOrderNumber: 'Include order number in message',
    orderNumber: 'Order Number',
    amount: 'Amount',
    instructions: 'Instructions',
    instruction1: '1. Open PayMe app',
    instruction2: '2. Tap "Scan QR Code"',
    instruction3: '3. Scan the QR code above',
    instruction4: '4. Pay {{amount}}',
    instruction5: '5. Include "{{orderNumber}}" in message',
    instruction6: '6. We\'ll confirm payment shortly',
    
    // Order
    orderConfirmed: 'Order Confirmed',
    thankYou: 'Thank you for your order!',
    orderNumberIs: 'Your order number is',
    orderStatus: 'Order Status',
    pendingPayment: 'Pending Payment',
    paid: 'Paid',
    processing: 'Processing',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    allOrders: 'All Orders',
    markAsPaid: 'Mark as Paid',
    markAsDelivered: 'Mark as Delivered',
    customerDetails: 'Customer Details',
    orderDetails: 'Order Details',
    orderHistory: 'Order History',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    search: 'Search',
    filter: 'Filter',
    sortBy: 'Sort By',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    newest: 'Newest',
    popular: 'Most Popular',
  },
  
  zh: {
    // App
    appTitle: '五金商店',
    welcome: '歡迎來到五金商店',
    
    // Navigation
    home: '首頁',
    products: '產品',
    cart: '購物車',
    orders: '訂單',
    profile: '個人資料',
    
    // Categories
    all: '全部',
    tools: '工具',
    plumbing: '水管',
    electrical: '電器',
    painting: '油漆',
    hardware: '五金',
    safety: '安全裝備',
    
    // Product
    addToCart: '加入購物車',
    inStock: '有貨',
    outOfStock: '缺貨',
    onlyLeft: '只剩{{count}}件',
    rating: '評分',
    reviews: '評價',
    
    // Cart
    yourCart: '你的購物車',
    cartEmpty: '購物車是空的',
    itemsInCart: '購物車有{{count}}件商品',
    itemInCart: '購物車有{{count}}件商品',
    quantity: '數量',
    remove: '移除',
    subtotal: '小計',
    total: '總計',
    checkout: '結帳',
    
    // Checkout
    checkoutWithPayMe: '使用PayMe結帳',
    shippingAddress: '送貨地址',
    paymentMethod: '付款方式',
    orderSummary: '訂單摘要',
    placeOrder: '下單',
    
    // PayMe
    payWithPayMe: '使用PayMe付款',
    scanQRCode: '掃描QR碼',
    includeOrderNumber: '在訊息中包含訂單號碼',
    orderNumber: '訂單號碼',
    amount: '金額',
    instructions: '指示',
    instruction1: '1. 打開PayMe應用程式',
    instruction2: '2. 點擊「掃描QR碼」',
    instruction3: '3. 掃描上面的QR碼',
    instruction4: '4. 支付{{amount}}',
    instruction5: '5. 在訊息中包含「{{orderNumber}}」',
    instruction6: '6. 我們會盡快確認付款',
    
    // Order
    orderConfirmed: '訂單已確認',
    thankYou: '感謝你的訂單！',
    orderNumberIs: '你的訂單號碼是',
    orderStatus: '訂單狀態',
    pendingPayment: '等待付款',
    paid: '已付款',
    processing: '處理中',
    delivered: '已送貨',
    cancelled: '已取消',
    
    // Admin
    adminDashboard: '管理員儀表板',
    allOrders: '所有訂單',
    markAsPaid: '標記為已付款',
    markAsDelivered: '標記為已送貨',
    customerDetails: '客戶資料',
    orderDetails: '訂單詳情',
    orderHistory: '訂單歷史',
    
    // Common
    loading: '載入中...',
    error: '錯誤',
    success: '成功',
    save: '儲存',
    cancel: '取消',
    back: '返回',
    next: '下一步',
    search: '搜尋',
    filter: '篩選',
    sortBy: '排序方式',
    priceLowToHigh: '價格：低至高',
    priceHighToLow: '價格：高至低',
    newest: '最新',
    popular: '最受歡迎',
  }
};

// Helper function to get translation with variables
function t(key, lang = 'en', variables = {}) {
  let text = translations[lang]?.[key] || translations['en'][key] || key;
  
  // Replace variables like {{variable}}
  Object.keys(variables).forEach(variable => {
    text = text.replace(`{{${variable}}}`, variables[variable]);
  });
  
  return text;
}

// Language detection and switching
function getBrowserLanguage() {
  const lang = navigator?.language || 'en';
  return lang.startsWith('zh') ? 'zh' : 'en';
}

module.exports = { translations, t, getBrowserLanguage };