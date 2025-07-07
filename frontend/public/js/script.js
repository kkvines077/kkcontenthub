let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = cart.length;
  });
}

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>₹${product.price}</p>
        <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
      </div>
    `).join('');
    updateCartCount();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function addToCart(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Product added to cart!');
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    cartTotal.textContent = 'Total: ₹0';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>
        <div>
          <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', this.value)">
          <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: ₹${total}`;
  }
  updateCartCount();
}

function updateCartQuantity(id, quantity) {
  cart = cart.map(item => item.id === id ? { ...item, quantity: parseInt(quantity) } : item);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

async function uploadProduct(event) {
  event.preventDefault();
  const form = event.target;
  const formData = {
    name: form.name.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    image: form.image.value
  };
  try {
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    alert('Product uploaded successfully!');
    form.reset();
  } catch (error) {
    console.error('Error uploading product:', error);
    alert('Failed to upload product.');
  }
}

async function login(event) {
  event.preventDefault();
  const form = event.target;
  const formData = {
    email: form.email.value,
    password: form.password.value
  };
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('Login successful!');
      window.location.href = 'index.html';
    } else {
      alert('Invalid credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed.');
  }
}

async function signup(event) {
  event.preventDefault();
  const form = event.target;
  const formData = {
    name: form.name.value,
    email: form.email.value,
    mobile: form.mobile.value,
    password: form.password.value
  };
  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('Signup successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert('Signup failed.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed.');
  }
}

function displayCheckout() {
  const orderSummary = document.getElementById('order-summary');
  const orderTotal = document.getElementById('order-total');
  if (cart.length === 0) {
    orderSummary.innerHTML = '<p>Your cart is empty.</p>';
    orderTotal.textContent = 'Total: ₹0';
  } else {
    orderSummary.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>${item.name} (x${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    orderTotal.textContent = `Total: ₹${total}`;
  }
  updateCartCount();
}

function proceedToPayment(event) {
  event.preventDefault();
  const address = {
    street: document.getElementById('street').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip: document.getElementById('zip').value,
    country: document.getElementById('country').value
  };
  // Here you can send address to backend if needed
  console.log('Address:', address);
  window.location.href = 'https://razorpay.me/@chorbazar3752';
}

updateCartCount();
