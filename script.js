// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('lostMobileForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('formMessage').textContent = 
        "Report submitted successfully. Your Report ID is: REP" + Math.floor(Math.random()*10000);
    });
  }
});

function checkStatus() {
  const reportId = document.getElementById('reportId').value;
  if (reportId.trim() === "") {
    alert("Please enter a Report ID");
    return;
  }
  document.getElementById('statusResult').textContent = 
    "Your report is being processed. Please check back later.";
}

function adminLogin() {
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;
  if (user === "admin" && pass === "admin123") {
    document.getElementById('adminMessage').textContent = "Login successful!";
  } else {
    document.getElementById('adminMessage').textContent = "Invalid credentials";
  }
}
