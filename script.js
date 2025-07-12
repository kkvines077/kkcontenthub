// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD4OiQMtKJdUz7Qcu6GyXKD-AwqA8MOE0o",
  authDomain: "videarn-9b7f0.firebaseapp.com",
  projectId: "videarn-9b7f0",
  storageBucket: "videarn-9b7f0.firebasestorage.app",
  messagingSenderId: "548163414285",
  appId: "1:548163414285:web:48d29b47c9b0e112a66844",
  measurementId: "G-VGNT49S5KV"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let confirmationResult = null;

// Setup reCAPTCHA
window.onload = () => {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
      // reCAPTCHA solved
    }
  });
};

function sendOTP() {
  const phoneNumber = document.getElementById("phoneNumber").value;
  const appVerifier = window.recaptchaVerifier;

  auth.signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((result) => {
      confirmationResult = result;
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("otpContainer").style.display = "block";
      document.getElementById("status").textContent = "📩 OTP Sent!";
    })
    .catch((error) => {
      document.getElementById("status").textContent = "❌ Error: " + error.message;
    });
}

function verifyOTP() {
  const otpCode = document.getElementById("otpCode").value;

  confirmationResult.confirm(otpCode)
    .then((result) => {
      document.getElementById("status").textContent = "✅ Login Successful!";
      window.location.href = "upload.html";
    })
    .catch((error) => {
      document.getElementById("status").textContent = "❌ Invalid OTP.";
    });
}
