// chat.js
import { db, auth } from './firebase.js';
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Send message
export async function sendMessage(text, toUID) {
  const currentUser = auth.currentUser;
  if (!currentUser || !toUID) return;

  await addDoc(collection(db, "messages"), {
    text,
    from: currentUser.uid,
    to: toUID,
    timestamp: serverTimestamp()
  });
}

// Listen for new messages between currentUser and selected friend
export function listenForMessages(toUID, callback) {
  const currentUser = auth.currentUser;
  if (!currentUser || !toUID) return;

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef,
    orderBy("timestamp"));

  onSnapshot(q, (snapshot) => {
    const msgs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (
        (data.from === currentUser.uid && data.to === toUID) ||
        (data.from === toUID && data.to === currentUser.uid)
      ) {
        msgs.push(data);
      }
    });
    callback(msgs);
  });
}
