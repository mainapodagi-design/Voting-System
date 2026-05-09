import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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
// INIT FIREBASE
// ==========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================
// ELEMENTS
// ==========================
const form = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// ==========================
// SHOW / HIDE PASSWORD (FIXED)
// ==========================
togglePassword.addEventListener("change", () => {
  passwordInput.type = togglePassword.checked ? "text" : "password";
});

// ==========================
// MESSAGE POPUP
// ==========================
function showMessage(text, color = "black") {
  let msg = document.getElementById("loginMessage");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "loginMessage";

    // popup style
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.padding = "12px 20px";
    msg.style.borderRadius = "8px";
    msg.style.fontSize = "14px";
    msg.style.zIndex = "9999";
    msg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    
    document.body.appendChild(msg);
  }

  msg.innerText = text;
  msg.style.background = color;
  msg.style.color = "white";

  // auto hide
  setTimeout(() => {
    msg.remove();
  }, 2500);
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

    await signInWithEmailAndPassword(auth, email, password);

    showMessage("Login successful ✔", "green");

    setTimeout(() => {
      window.location.href = "../dashboard.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    showMessage("Invalid login details ❌", "red");
  }
});