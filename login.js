function renderNav() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = document.getElementById("nav-links");

  if (user) {
    nav.innerHTML = `
      <span class="welcome">👋 Hi, ${user.name}</span>
      <a href="#" class="btn logout" onclick="logout()">🚪 Logout</a>
      <a href="cart.html" class="cart">🛒 Cart</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html" class="btn">🔐 Login</a>
      <a href="signup.html" class="btn">📝 Signup</a>
      <a href="cart.html" class="cart">🛒 Cart</a>
    `;
  }
}

function logout() {
  localStorage.removeItem("user");
  alert("You have been logged out.");
  location.reload();
}

window.onload = renderNav;
