checkLogin();

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const suggestionsBox = document.getElementById("suggestions");
const currentFriend = localStorage.getItem("chatWith") || "Default";

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("chat_" + currentFriend)) || [];
  chatBox.innerHTML = "";
  messages.forEach(msg => {
    appendMessage(msg.text, msg.sender);
  });
}

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg === "") return;

  appendMessage(msg, "user");
  saveMessage(msg, "user");
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

function saveMessage(msg, sender) {
  let messages = JSON.parse(localStorage.getItem("chat_" + currentFriend)) || [];
  messages.push({ text: msg, sender });
  localStorage.setItem("chat_" + currentFriend, JSON.stringify(messages));
}

function showSmartReplies(input) {
  suggestionsBox.innerHTML = "";
  let suggestions = generateSuggestions(input);
  suggestions.forEach(reply => {
    const btn = document.createElement("button");
    btn.innerText = reply;
    btn.onclick = () => {
      appendMessage(reply, "bot");
      saveMessage(reply, "bot");
      suggestionsBox.innerHTML = "";
    };
    suggestionsBox.appendChild(btn);
  });
}

loadMessages();
