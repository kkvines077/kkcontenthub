window.onload = function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD4OiQMtKJdUz7Qcu6GyXKD-AwqA8MOE0o",
    authDomain: "videarn-9b7f0.firebaseapp.com",
    projectId: "videarn-9b7f0",
    storageBucket: "videarn-9b7f0.firebasestorage.app",
    messagingSenderId: "548163414285",
    appId: "1:548163414285:web:48d29b47c9b0e112a66844",
    measurementId: "G-VGNT49S5KV"
  };

  // ✅ Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  let confirmationResult;

  // ✅ Set up invisible reCAPTCHA once
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: function (response) {
      // reCAPTCHA solved, allow OTP
    }
  });

  function startResendCooldown() {
    let seconds = 30;
    const btn = document.getElementById("resendOtpBtn");
    btn.disabled = true;
    btn.textContent = `Resend OTP (${seconds}s)`;
    const timer = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        btn.textContent = `Resend OTP (${seconds}s)`;
      } else {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = "Resend OTP";
      }
    }, 1000);
  }

  // ✅ Send OTP
  document.getElementById("sendOtpBtn").addEventListener("click", () => {
    const phoneNumber = document.getElementById("phoneNumber").value;
    const appVerifier = window.recaptchaVerifier;

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((result) => {
        confirmationResult = result;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("otpContainer").style.display = "block";
        document.getElementById("status").textContent = "📩 OTP sent!";
        startResendCooldown();
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ " + error.message;
        console.error(error);
      });
  });

  // ✅ Resend OTP
  document.getElementById("resendOtpBtn").addEventListener("click", () => {
    document.getElementById("sendOtpBtn").click();
  });

  // ✅ Verify OTP
  document.getElementById("verifyOtpBtn").addEventListener("click", () => {
    const code = document.getElementById("otpCode").value;
    confirmationResult.confirm(code)
      .then((result) => {
        document.getElementById("status").textContent = "✅ Login successful!";
        window.location.href = "upload.html";
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ Invalid OTP";
      });
  });
};
