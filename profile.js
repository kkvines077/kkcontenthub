// profile.js
import { auth, db, storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const profilePicInput = document.getElementById("profilePicInput");
const profilePicPreview = document.getElementById("profilePicPreview");
const displayNameInput = document.getElementById("displayName");
const bioInput = document.getElementById("bio");
const saveBtn = document.getElementById("saveProfile");
const status = document.getElementById("status");

let selectedFile = null;
profilePicInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  profilePicPreview.src = URL.createObjectURL(selectedFile);
});

saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please login first");

  const uid = user.uid;
  const name = displayNameInput.value.trim();
  const bio = bioInput.value.trim();
  status.textContent = "Saving...";

  let photoURL = null;

  try {
    if (selectedFile) {
      const imageRef = ref(storage, `profiles/${uid}/profile.jpg`);
      await uploadBytes(imageRef, selectedFile);
      photoURL = await getDownloadURL(imageRef);
    }

    await setDoc(doc(db, "users", uid), {
      uid,
      name,
      bio,
      photoURL,
    });

    status.textContent = "Profile updated successfully!";
  } catch (err) {
    console.error(err);
    status.textContent = "Error updating profile.";
  }
});
    
