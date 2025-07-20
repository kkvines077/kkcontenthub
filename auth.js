function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);
  alert("Signup successful!");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (email === savedEmail && password === savedPassword) {
    alert("Login successful!");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "friends.html";
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("chatWith");
  window.location.href = "login.html";
}

function checkLogin() {
  const loggedIn = localStorage.getItem("isLoggedIn");
  if (loggedIn !== "true") {
    window.location.href = "login.html";
  }
}
