// login.js

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Simulate login by saving user to localStorage
  const user = { email };
  localStorage.setItem("user", JSON.stringify(user));

  alert("Login successful!");
  window.location.href = "index.html";
}

function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  const headerLinks = document.querySelector(".header-links");

  if (user && headerLinks) {
    // If logged in, show logout
    headerLinks.innerHTML = `
      <span>👋 ${user.email}</span>
      <a href="#" class="btn" onclick="logout()">🚪 Logout</a>
      <a href="cart.html" class="cart">🛒 Cart</a>
    `;
  }
}

function logout() {
  localStorage.removeItem("user");
  alert("Logged out!");
  window.location.reload();
}

// Automatically run on pages with header
window.onload = checkLoginStatus;
