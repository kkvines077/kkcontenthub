let localStream;
let remoteStream;
let peerConnection;
let socket;

const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const roomName = "defaultRoom";

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startBtn = document.getElementById("startBtn");
const hangupBtn = document.getElementById("hangupBtn");

startBtn.addEventListener("click", requestPermission);
hangupBtn.addEventListener("click", hangUp);

async function requestPermission() {
  try {
    // Browser will ask camera & mic permission here
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    startCall(); // only start WebRTC after permission granted
  } catch (error) {
    alert("Camera & microphone permission denied!");
    console.error(error);
  }
}

async function startCall() {
  startBtn.disabled = true;
  hangupBtn.disabled = false;

  socket = new WebSocket("ws://localhost:3000");
  socket.onmessage = onMessage;

  socket.onopen = async () => {
    await setupPeerConnection();
    sendMessage({ type: "join", room: roomName });
  };
}

async function setupPeerConnection() {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();
  remoteVideo.srcObject = remoteStream;

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  peerConnection.ontrack = (e) => e.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendMessage({ type: "candidate", candidate: event.candidate, room: roomName });
    }
  };
}

async function onMessage(event) {
  const data = JSON.parse(event.data);

  if (data.type === "joined" && data.youAreCaller) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendMessage({ type: "offer", offer, room: roomName });
  } else if (data.type === "offer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendMessage({ type: "answer", answer, room: roomName });
  } else if (data.type === "answer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.type === "candidate") {
    try {
      await peerConnection.addIceCandidate(data.candidate);
    } catch (e) {
      console.error("Error adding ICE candidate", e);
    }
  }
}

function sendMessage(msg) {
  socket.send(JSON.stringify(msg));
}

function hangUp() {
  hangupBtn.disabled = true;
  startBtn.disabled = false;

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  remoteVideo.srcObject = null;
  localVideo.srcObject = null;

  if (socket) socket.close();
}
