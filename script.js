const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const suggestionsBox = document.getElementById("suggestions");

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg === "") return;

  appendMessage(msg, "user");
  messageInput.value = "";
  showSmartReplies(msg);
}

function appendMessage(msg, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = msg;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showSmartReplies(input) {
  suggestionsBox.innerHTML = "";

  let suggestions = generateSuggestions(input);

  suggestions.forEach(reply => {
    const btn = document.createElement("button");
    btn.innerText = reply;
    btn.onclick = () => {
      appendMessage(reply, "bot");
      suggestionsBox.innerHTML = "";
    };
    suggestionsBox.appendChild(btn);
  });
}

function generateSuggestions(text) {
  const emojiMap = {
    "😊": ["Glad to hear that!", "You're awesome!", "Stay happy!"],
    "😢": ["Don't worry, things get better!", "I'm here for you."],
    "❤️": ["Love you too!", "Sending love!", "So sweet!"],
  };

  if (emojiMap[text]) {
    return emojiMap[text];
  }

  if (text.toLowerCase().includes("hello")) return ["Hi!", "Hello!", "Hey there!"];
  if (text.toLowerCase().includes("how are you")) return ["I'm great! You?", "Doing well, thanks!"];
  if (text.toLowerCase().includes("bye")) return ["Goodbye!", "Take care!", "See you soon!"];

  return ["That's interesting!", "Tell me more!", "Really?"];
}
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
