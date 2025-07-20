// script.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, query, orderBy, onSnapshot, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const friends = ["user1@example.com", "user2@example.com"];
let currentUser;
let currentChatWith = localStorage.getItem("chatWith") || null;

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user.email;

    if (window.location.pathname.includes("index.html")) {
      const friendList = document.getElementById("friendList");
      friendList.innerHTML = "";
      friends.forEach(friend => {
        if (friend !== currentUser) {
          const btn = document.createElement("button");
          btn.innerText = friend;
          btn.onclick = () => {
            localStorage.setItem("chatWith", friend);
            window.location.href = "chat.html";
          };
          friendList.appendChild(btn);
        }
      });
    }

    if (window.location.pathname.includes("chat.html")) {
      document.getElementById("chatWith").innerText = `Chatting with: ${currentChatWith}`;
      document.getElementById("messageInput").addEventListener("keyup", e => {
        if (e.key === "Enter") send();
      });
      listenForMessages();
    }
  }
});

window.send = async function () {
  const text = document.getElementById("messageInput").value;
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    from: currentUser,
    to: currentChatWith,
    text,
    timestamp: new Date()
  });

  document.getElementById("messageInput").value = "";
  generateSmartReplies(text);
};

function listenForMessages() {
  const q = query(
    collection(db, "messages"),
    orderBy("timestamp", "asc")
  );

  onSnapshot(q, snapshot => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      if (
        (data.from === currentUser && data.to === currentChatWith) ||
        (data.to === currentUser && data.from === currentChatWith)
      ) {
        const div = document.createElement("div");
        div.innerText = `${data.from}: ${data.text}`;
        chatBox.appendChild(div);
      }
    });
  });
}

function generateSmartReplies(message) {
  const smartReplies = {
    "😊": ["Glad to hear that!", "Awesome!", "Keep smiling 😊"],
    "😢": ["I'm here for you", "Everything will be fine", "Sending hugs 😢"],
    "hello": ["Hi!", "Hello there!", "Hey, how are you?"],
    "thanks": ["You're welcome!", "Anytime!", "No problem!"]
  };

  const replyBox = document.getElementById("smartReplyBox");
  replyBox.innerHTML = "";
  Object.keys(smartReplies).forEach(key => {
    if (message.toLowerCase().includes(key)) {
      smartReplies[key].forEach(reply => {
        const btn = document.createElement("button");
        btn.innerText = reply;
        btn.onclick = () => {
          document.getElementById("messageInput").value = reply;
        };
        replyBox.appendChild(btn);
      });
    }
  });
}
