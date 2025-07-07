const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DB = {
  admins: './data/admins.json',
  products: './data/products.json',
  orders: './data/orders.json'
};

const loadData = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admins = loadData(DB.admins);
  const admin = admins.find(u => u.username === username);
  if (!admin) return res.status(401).json({ message: 'Admin not found' });

  bcrypt.compare(password, admin.password, (err, result) => {
    if (result) {
      res.json({ message: 'Login success', token: 'fake-jwt-token' });
    } else {
      res.status(403).json({ message: 'Invalid password' });
    }
  });
});

// Product routes
app.get('/admin/products', (req, res) => {
  const products = loadData(DB.products);
  res.json(products);
});

app.post('/admin/products', (req, res) => {
  const products = loadData(DB.products);
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    image: req.body.image
  };
  products.push(newProduct);
  saveData(DB.products, products);
  res.json({ message: 'Product added', product: newProduct });
});

// Orders
app.get('/admin/orders', (req, res) => {
  const orders = loadData(DB.orders);
  res.json(orders);
});

app.post('/order', (req, res) => {
  const orders = loadData(DB.orders);
  const newOrder = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    customer: req.body.customer,
    items: req.body.items,
    address: req.body.address,
    mobile: req.body.mobile,
    status: 'Placed'
  };
  orders.push(newOrder);
  saveData(DB.orders, orders);
  res.json({ message: 'Order placed', order: newOrder });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
