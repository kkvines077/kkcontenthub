// Wait until page is fully loaded
window.onload = function () {
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

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  let confirmationResult;

  // Setup invisible reCAPTCHA
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
      // reCAPTCHA solved
    }
  });

  // ✅ Send OTP
  document.getElementById("sendOtpBtn").addEventListener("click", () => {
    const phoneNumber = document.getElementById("phoneNumber").value;

    auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("otpContainer").style.display = "block";
        document.getElementById("status").textContent = "📩 OTP sent!";
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ Error: " + error.message;
      });
  });

  // ✅ Verify OTP
  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    const otpCode = document.getElementById("otpCode").value;

    confirmationResult.confirm(otpCode)
      .then((result) => {
        document.getElementById("status").textContent = "✅ Login Successful!";
        window.location.href = "upload.html";
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ Invalid OTP.";
      });
  });
};
