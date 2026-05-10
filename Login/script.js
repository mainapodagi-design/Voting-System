import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// ==========================
// FIREBASE CONFIG
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyDJGM-_sV1SDgES4Vr9UwOHEoQlr_2wJsw",
  authDomain: "mtsa-voting-system-backhand.firebaseapp.com",
  databaseURL: "https://mtsa-voting-system-backhand-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mtsa-voting-system-backhand",
  storageBucket: "mtsa-voting-system-backhand.appspot.com",
  messagingSenderId: "703541465424",
  appId: "1:703541465424:web:003fe43a403282b9169c55"
};

// ==========================
// INIT
// ==========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ==========================
// FORM
// ==========================
const form = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// password toggle
togglePassword.addEventListener("change", () => {
  passwordInput.type = togglePassword.checked ? "text" : "password";
});

// popup message
function showMessage(text, color = "black") {
  let msg = document.getElementById("loginMessage");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "loginMessage";
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.padding = "12px 20px";
    msg.style.borderRadius = "8px";
    msg.style.color = "white";
    msg.style.zIndex = "9999";
    document.body.appendChild(msg);
  }

  msg.innerText = text;
  msg.style.background = color;

  setTimeout(() => msg.remove(), 2500);
}

// ==========================
// LOGIN
// ==========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = form.querySelector("input[type='text']").value.trim();
  const password = passwordInput.value;

  try {
    let email = input;

    // convert student ID → email
    if (/^2\d{5}$/.test(input)) {
      email = input + "@student.dwu.ac.pg";
    }

    // 1. AUTH LOGIN (THIS IS THE REAL CHECK)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. OPTIONAL: fetch user data from Realtime Database
    const snapshot = await get(ref(db, "students/" + user.uid));

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("User profile:", data);
    }

    showMessage("Login successful ✔", "green");

    setTimeout(() => {
      window.location.href = "../VotingPage/vote.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    showMessage("Invalid login details ❌", "red");
  }
});