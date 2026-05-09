import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// ==========================
// FIREBASE CONFIG (YOUR EXACT ONE)
// ==========================
const firebaseConfig = {
    apiKey: "AIzaSyDJGM-_sV1SDgES4Vr9UwOHEoQlr_2wJsw",
    authDomain: "mtsa-voting-system-backhand.firebaseapp.com",
    databaseURL: "https://mtsa-voting-system-backhand-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mtsa-voting-system-backhand",
    storageBucket: "mtsa-voting-system-backhand.firebasestorage.app",
    messagingSenderId: "703541465424",
    appId: "1:703541465424:web:003fe43a403282b9169c55",
    measurementId: "G-RT8547KM4E"
};

// ==========================
// INITIALIZE FIREBASE
// ==========================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// ==========================
// FORM ELEMENTS
// ==========================
const form = document.getElementById("registerForm");
const studentIDInput = document.getElementById("studentID");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const message = document.getElementById("message");

// ==========================
// AUTO EMAIL GENERATION
// ==========================
studentIDInput.addEventListener("input", () => {
    const id = studentIDInput.value.trim();

    if (/^2\d{5}$/.test(id)) {
        emailInput.value = id + "@student.dwu.ac.pg";
    } else {
        emailInput.value = "";
    }
});

// ==========================
// CONFIRM PASSWORD CHECK
// ==========================
confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordInput.style.border = "2px solid red";
    } else {
        confirmPasswordInput.style.border = "2px solid green";
    }
});

// ==========================
// SUBMIT FORM
// ==========================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentID = studentIDInput.value.trim();
    const email = studentID + "@student.dwu.ac.pg";
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!/^2\d{5}$/.test(studentID)) {
        message.innerText = "Student ID must start with 2 and be 6 digits";
        message.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "Passwords do not match";
        message.style.color = "red";
        return;
    }

    try {
        message.innerText = "Creating account...";
        message.style.color = "blue";

        // 1. CREATE AUTH USER (SECURE LOGIN)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. STORE EXTRA DATA IN REALTIME DB
        await set(ref(db, "students/" + user.uid), {
            firstname: document.getElementById("firstname").value.trim(),
            middlename: document.getElementById("middlename").value.trim(),
            lastname: document.getElementById("lastname").value.trim(),
            student_id: studentID,
            email: email,
            faculty: document.getElementById("faculty").value,
            course: document.getElementById("course").value,
            createdAt: new Date().toISOString()
        });

        message.innerText = "Account created successfully!";
        message.style.color = "green";

        form.reset();
        emailInput.value = "";

    } catch (error) {
        console.error(error);
        message.innerText = error.message;
        message.style.color = "red";
    }
});