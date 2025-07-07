const API = "http://localhost:5000/api";

// ---------------------- Signup ----------------------
async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, mobile, password }),
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) window.location.href = "login.html";
}

// ---------------------- Login ----------------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "index.html";
  } else {
    alert(data.message);
  }
}

// ---------------------- Show Products ----------------------
async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();
  const list = document.getElementById("productList");

  products.forEach((p) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${p.image}" width="100%" height="150" />
      <h4>${p.title}</h4>
      <p>₹${p.price}</p>
      <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
    `;
    list.appendChild(div);
  });
}

if (document.getElementById("productList")) fetchProducts();

// ---------------------- Cart Logic ----------------------
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

function showCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const div = document.getElementById("cartItems");

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const el = document.createElement("div");
    el.innerHTML = `${item.title} - ₹${item.price}`;
    div.appendChild(el);
  });

  localStorage.setItem("total", total);
}

if (document.getElementById("cartItems")) showCart();

// ---------------------- Razorpay Checkout ----------------------
async function checkout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const address = document.getElementById("address").value;
  const total = localStorage.getItem("total");

  if (!address || cart.length === 0 || !user) {
    return alert("Missing address, cart, or user");
  }

  const options = {
    key: "rzp_test_dummykey", // dummy key, not required for redirect
    amount: total * 100,
    currency: "INR",
    name: "ChorBazar",
    description: "Order Payment",
    handler: async function (response) {
      await fetch(`${API}/orders/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cart,
          address,
          razorpay_payment_id: response.razorpay_payment_id,
        }),
      });

      alert("Payment Successful! Order Placed.");
      localStorage.removeItem("cart");
      window.location.href = "order.html";
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.mobile,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// ---------------------- Order History ----------------------
async function fetchOrders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await fetch(`${API}/orders/user/${user._id}`);
  const orders = await res.json();
  const div = document.getElementById("orderList");

  orders.forEach((o) => {
    const el = document.createElement("div");
    el.innerHTML = `
      <p><b>Items:</b> ${o.items.map((i) => i.title).join(", ")}</p>
      <p><b>Address:</b> ${o.address}</p>
      <p><b>Status:</b> ${o.status}</p>
      <button onclick="cancelOrder('${o._id}')">Cancel</button>
      <hr/>
    `;
    div.appendChild(el);
  });
}

if (document.getElementById("orderList")) fetchOrders();

// ---------------------- Cancel Order ----------------------
async function cancelOrder(id) {
  const res = await fetch(`${API}/orders/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: id }),
  });

  const data = await res.json();
  alert(data.message);
  location.reload();
}

// ---------------------- Upload Product ----------------------
async function uploadProduct() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;

  const res = await fetch(`${API}/products/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, price, image }),
  });

  const data = await res.json();
  alert(data.message);
}

// ---------------------- User Greeting + Button Hide ----------------------
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const userName = document.getElementById("userName");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (userName) userName.innerText = `Welcome, ${user.name}`;
  }
};
