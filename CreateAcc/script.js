import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";


// ======================================
// FIREBASE CONFIG
// ======================================
const firebaseConfig = {
    apiKey: "AIzaSyDJGM-_sV1SDgES4Vr9UwOHEoQlr_2wJsw",
    authDomain: "mtsa-voting-system-backhand.firebaseapp.com",
    databaseURL:
        "https://mtsa-voting-system-backhand-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "mtsa-voting-system-backhand",

    storageBucket:
        "mtsa-voting-system-backhand.firebasestorage.app",

    messagingSenderId: "703541465424",

    appId:
        "1:703541465424:web:003fe43a403282b9169c55",

    measurementId: "G-RT8547KM4E"
};


// ======================================
// INITIALIZE FIREBASE
// ======================================
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getDatabase(app);


// ======================================
// FORM ELEMENTS
// ======================================
const form =
    document.getElementById("registerForm");

const firstnameInput =
    document.getElementById("firstname");

const middlenameInput =
    document.getElementById("middlename");

const lastnameInput =
    document.getElementById("lastname");

const studentIDInput =
    document.getElementById("studentID");

const emailInput =
    document.getElementById("email");

const facultySelect =
    document.getElementById("faculty");

const courseSelect =
    document.getElementById("course");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const message =
    document.getElementById("message");


// ======================================
// MESSAGE BOX FUNCTION
// ======================================
function showMessage(text, color) {

    message.innerText = text;

    message.style.display = "block";

    message.style.padding = "12px";

    message.style.marginTop = "15px";

    message.style.borderRadius = "10px";

    message.style.fontWeight = "600";

    message.style.textAlign = "center";

    message.style.color = color;

    // BACKGROUND COLORS
    if (color === "red") {

        message.style.background =
            "rgba(255,0,0,0.12)";

    } else if (color === "green") {

        message.style.background =
            "rgba(0,255,0,0.12)";

    } else {

        message.style.background =
            "rgba(0,0,255,0.12)";
    }

    // AUTO HIDE
    setTimeout(() => {

        message.style.display = "none";

    }, 4000);
}


// ======================================
// FACULTY DEPARTMENTS
// ======================================
const facultyDepartments = {

    fbi: [
        "Computer Science",
        "Accounting",
        "Business Management",
        "Information Systems",
        "Economics"
    ],

    fmhs: [
        "Nursing",
        "Public Health",
        "Pharmacy",
        "Medical Laboratory",
        "Midwifery",
        "Environmental Health",
        "Clinical Medicine"
    ],

    fass: [
        "Political Science",
        "Psychology",
        "Social Work",
        "Communication Arts"
    ],

    education: [
        "Primary Education",
        "Secondary Education",
        "Curriculum Studies",
        "Educational Leadership"
    ],

    clt: [
        "Academic Support",
        "Digital Learning",
        "Teacher Training",
        "Research Development",
        "Curriculum Design",
        "Assessment & Evaluation"
    ],

    flc: [
        "Foundation English",
        "Foundation Mathematics",
        "Business Studies",
        "ICT Fundamentals",
        "Science Foundation",
        "Communication Skills",
        "Community Development",
        "Hospitality",
        "Tourism",
        "Entrepreneurship",
        "Office Administration",
        "Agriculture",
        "Basic Accounting",
        "Human Resource",
        "Marketing",
        "Project Management",
        "Statistics",
        "Leadership Training",
        "Adult Learning"
    ]
};


// ======================================
// FACULTY CHANGE EVENT
// ======================================
facultySelect.addEventListener("change", () => {

    const selectedFaculty =
        facultySelect.value;

    // CLEAR OLD OPTIONS
    courseSelect.innerHTML =
        '<option value="">Select Department</option>';

    if (selectedFaculty === "") return;

    // GET DEPARTMENTS
    const departments =
        facultyDepartments[selectedFaculty];

    // CREATE OPTIONS
    departments.forEach((department) => {

        const option =
            document.createElement("option");

        option.value = department;

        option.textContent = department;

        courseSelect.appendChild(option);
    });
});


// ======================================
// AUTO EMAIL GENERATION
// ======================================
studentIDInput.addEventListener("input", () => {

    const id =
        studentIDInput.value.trim();

    // MUST START WITH 2
    // MUST BE 6 DIGITS
    if (/^2\d{5}$/.test(id)) {

        emailInput.value =
            id + "@student.dwu.ac.pg";

    } else {

        emailInput.value = "";
    }
});


// ======================================
// PASSWORD MATCH CHECK
// ======================================
confirmPasswordInput.addEventListener("input", () => {

    if (
        confirmPasswordInput.value !==
        passwordInput.value
    ) {

        confirmPasswordInput.style.border =
            "2px solid red";

    } else {

        confirmPasswordInput.style.border =
            "2px solid lime";
    }
});


// ======================================
// CHECK IF STUDENT EXISTS
// ======================================
async function studentExists(studentID) {

    const dbRef = ref(db);

    const snapshot =
        await get(child(dbRef, "students"));

    if (snapshot.exists()) {

        const students = snapshot.val();

        for (const uid in students) {

            // CHECK STUDENT ID
            if (
                students[uid].student_id ===
                studentID
            ) {

                return true;
            }

            // CHECK EMAIL
            if (
                students[uid].email ===
                studentID +
                "@student.dwu.ac.pg"
            ) {

                return true;
            }
        }
    }

    return false;
}


// ======================================
// CREATE ACCOUNT
// ======================================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // ======================================
    // GET VALUES
    // ======================================
    const firstname =
        firstnameInput.value.trim();

    const middlename =
        middlenameInput.value.trim();

    const lastname =
        lastnameInput.value.trim();

    const studentID =
        studentIDInput.value.trim();

    const email =
        studentID +
        "@student.dwu.ac.pg";

    const faculty =
        facultySelect.value;

    const course =
        courseSelect.value;

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // ======================================
    // VALIDATE STUDENT ID
    // ======================================
    if (!/^2\d{5}$/.test(studentID)) {

        showMessage(
            "Student ID must start with 2 and be 6 digits",
            "red"
        );

        return;
    }


    // ======================================
    // VALIDATE PASSWORDS
    // ======================================
    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match",
            "red"
        );

        return;
    }


    // ======================================
    // VALIDATE FACULTY
    // ======================================
    if (faculty === "") {

        showMessage(
            "Please select a faculty",
            "red"
        );

        return;
    }


    // ======================================
    // VALIDATE COURSE
    // ======================================
    if (course === "") {

        showMessage(
            "Please select a department",
            "red"
        );

        return;
    }


    try {

        // ======================================
        // CHECK IF USER EXISTS
        // ======================================
        const exists =
            await studentExists(studentID);

        if (exists) {

            showMessage(
                "Username already exists",
                "red"
            );

            return;
        }


        // ======================================
        // LOADING MESSAGE
        // ======================================
        showMessage(
            "Creating account...",
            "blue"
        );


        // ======================================
        // CREATE FIREBASE AUTH ACCOUNT
        // ======================================
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            userCredential.user;


        // ======================================
        // SAVE USER DATA
        // ======================================
        await set(
            ref(db, "students/" + user.uid),
            {
                firstname: firstname,

                middlename: middlename,

                lastname: lastname,

                student_id: studentID,

                email: email,

                faculty: faculty,

                course: course,

                createdAt:
                    new Date().toISOString()
            }
        );


        // ======================================
        // SUCCESS MESSAGE
        // ======================================
        showMessage(
            "Account created successfully!",
            "green"
        );


        // ======================================
        // RESET FORM
        // ======================================
        form.reset();

        emailInput.value = "";

        courseSelect.innerHTML =
            '<option value="">Select Department</option>';

    } catch (error) {

        console.error(error);

        // ======================================
        // EMAIL ALREADY EXISTS
        // ======================================
        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            showMessage(
                "Username already exists",
                "red"
            );

        } else {

            showMessage(
                error.message,
                "red"
            );
        }
    }
});