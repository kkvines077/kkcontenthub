let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startBtn = document.getElementById("startBtn");
const hangupBtn = document.getElementById("hangupBtn");

startBtn.addEventListener("click", startCall);
hangupBtn.addEventListener("click", hangUp);

async function startCall() {
  startBtn.disabled = true;
  hangupBtn.disabled = false;

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(servers);
    peerConnection.ontrack = (event) => {
      if (!remoteVideo.srcObject) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Simulated loopback (no remote user, for demo)
    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      const remotePeer = new RTCPeerConnection(servers);
      remotePeer.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
      };
      localStream.getTracks().forEach(track => remotePeer.addTrack(track, localStream));
      remotePeer.setRemoteDescription(offer);
      remotePeer.createAnswer().then((answer) => {
        remotePeer.setLocalDescription(answer);
        peerConnection.setRemoteDescription(answer);
      });
    });
  } catch (error) {
    console.error("Error accessing media devices.", error);
    alert("Camera or microphone access denied!");
  }
}

function hangUp() {
  hangupBtn.disabled = true;
  startBtn.disabled = false;

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
}
