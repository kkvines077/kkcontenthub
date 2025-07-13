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
// Dark/Light Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}


  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  let confirmationResult;
  let resendTimer;

  // Setup invisible reCAPTCHA
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible'
  });

  // Send OTP
  document.getElementById("sendOtpBtn").addEventListener("click", () => {
    const phoneNumber = document.getElementById("phoneNumber").value;
    auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("otpContainer").style.display = "block";
        document.getElementById("status").textContent = "📩 OTP sent!";
        startResendCooldown();
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ " + error.message;
      });
  });

  // Resend OTP
  document.getElementById("resendOtpBtn").addEventListener("click", () => {
    document.getElementById("sendOtpBtn").click();
  });

  // Verify OTP
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

  // Google Sign-in
  document.getElementById("googleLoginBtn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        document.getElementById("status").textContent = "✅ Logged in with Google!";
        window.location.href = "upload.html";
      })
      .catch((error) => {
        document.getElementById("status").textContent = "❌ Google Login Error: " + error.message;
      });
  });

  // Resend OTP cooldown
  function startResendCooldown() {
    let seconds = 30;
    const btn = document.getElementById("resendOtpBtn");
    btn.disabled = true;
    btn.textContent = `Resend OTP (${seconds}s)`;

    resendTimer = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        btn.textContent = `Resend OTP (${seconds}s)`;
      } else {
        clearInterval(resendTimer);
        btn.disabled = false;
        btn.textContent = "Resend OTP";
      }
    }, 1000);
  }
};
