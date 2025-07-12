// ✅ Firebase Config
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

// ✅ Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
}

// ✅ Load saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
});

// ✅ Handle Auth UI
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMsg = document.getElementById("welcomeMessage");

  if (user) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    if (welcomeMsg) {
      welcomeMsg.textContent = `Welcome, ${user.email.split("@")[0]} 👋`;
    }
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    if (welcomeMsg) {
      welcomeMsg.textContent = `Earn by Uploading or Watching Videos`;
    }
  }
});

// ✅ Logout Function
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.reload();
    });
  });
}

function trackView(videoId) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  // Avoid counting every play event
  if (window.viewedVideos && window.viewedVideos[videoId]) return;
  window.viewedVideos = window.viewedVideos || {};
  window.viewedVideos[videoId] = true;

  // Wait 10 seconds before counting
  setTimeout(() => {
    firebase.firestore().collection("videos").doc(videoId).update({
      views: firebase.firestore.FieldValue.increment(1)
    });
  }, 10000);
}
let watched = {};

function trackWatch(videoId) {
  const user = firebase.auth().currentUser;
  if (!user || watched[videoId]) return;

  watched[videoId] = true;

  let secondsWatched = 0;
  const interval = setInterval(() => {
    secondsWatched += 1;

    if (secondsWatched === 30) {
      clearInterval(interval);

      // ✅ Save to Firestore
      firebase.firestore().collection("watchlogs").add({
        userId: user.uid,
        videoId: videoId,
        duration: secondsWatched,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // ✅ Add reward point
      firebase.firestore().collection("users").doc(user.uid).set({
        coins: firebase.firestore.FieldValue.increment(1)
      }, { merge: true });

      console.log("🪙 Rewarded 1 coin to", user.uid);
    }
  }, 1000);
}


