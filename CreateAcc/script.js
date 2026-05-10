import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";


// ==========================
// FIREBASE CONFIG
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

const firstnameInput = document.getElementById("firstname");
const middlenameInput = document.getElementById("middlename");
const lastnameInput = document.getElementById("lastname");

const studentIDInput = document.getElementById("studentID");

const emailInput = document.getElementById("email");

const facultySelect = document.getElementById("faculty");
const courseSelect = document.getElementById("course");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const message = document.getElementById("message");


// ==========================
// FACULTY & DEPARTMENTS
// ==========================
const facultyDepartments = {

    fbi: [
        "Mathematics and Computer Science",
        "Finance and Management",
        "Business Studies",
        "Information Systems",
        "Tourism and Hospitality",
    ],

    fmhs: [
        "Nursing",
        "Rural Health",
        "Health Management and Systems Development",
        "Medicicine",
        "Public Health Leaership and Training",
        "Rehabilitation Sciences",
        "Environmental Health",
    ],

    fass: [
        "Governance and Leadership",
        "Papua New Guinea and International Studies",
        "Social and Religious Studies",
        "Communication Arts"
    ],

    education: [
        "Sciences",
        "Humanities",
        "Education Curriculum and Leadership",
        "Educational and Professional Studies",
    ],

    clt: [
        "Academic Excellence",
        "Study Skills",
        "Writing Labs",
        "Numeracy Labs",
        "Moodle Support",
        "Personal Enrichment"
    ],

    flc: [
        "Bachelor of Public Administration",
        "Diploma in Justice Administration",
        "Diploma in Pastorial Ministry",
        "Diploma in Project Management",
        "Master of Leadership in Development",
        "Master of Public Administration",
        "Bachelor of Management",
        "Diploma in Business Studies",
        "Diploma in Human Resource Management",
        "Diploma in Management",
        "Graduate Certificate in Data Networking",
        "Master of Business Administration",
        "Master of Leadership in Business Administration",
        "Bachelor of Education (Primary, Inservice)",
        "Doctor of Education",
        "Master of Educational Leadership",
        "Bachelor of Health Science (Rural Health, Inservice)",
        "Diploma in Health Service Management",
        "Master of Public Health – Health Services Management"
    ]
};


// ==========================
// FACULTY DROPDOWN FUNCTION
// ==========================
facultySelect.addEventListener("change", () => {

    const selectedFaculty = facultySelect.value;

    // CLEAR OLD OPTIONS
    courseSelect.innerHTML =
        '<option value="">Select Department</option>';

    // IF NOTHING SELECTED
    if (selectedFaculty === "") return;

    // GET DEPARTMENTS
    const departments =
        facultyDepartments[selectedFaculty];

    // ADD OPTIONS
    departments.forEach((department) => {

        const option = document.createElement("option");

        option.value = department;
        option.textContent = department;

        courseSelect.appendChild(option);
    });
});


// ==========================
// AUTO EMAIL GENERATION
// ==========================
studentIDInput.addEventListener("input", () => {

    const id = studentIDInput.value.trim();

    // STUDENT ID MUST START WITH 2
    // AND BE 6 DIGITS
    if (/^2\d{5}$/.test(id)) {

        emailInput.value =
            id + "@student.dwu.ac.pg";

    } else {

        emailInput.value = "";
    }
});


// ==========================
// PASSWORD CONFIRMATION
// ==========================
confirmPasswordInput.addEventListener("input", () => {

    if (
        confirmPasswordInput.value !==
        passwordInput.value
    ) {

        confirmPasswordInput.style.border =
            "2px solid red";

    } else {

        confirmPasswordInput.style.border =
            "2px solid green";
    }
});


// ==========================
// CREATE ACCOUNT
// ==========================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const firstname =
        firstnameInput.value.trim();

    const middlename =
        middlenameInput.value.trim();

    const lastname =
        lastnameInput.value.trim();

    const studentID =
        studentIDInput.value.trim();

    const email =
        studentID + "@student.dwu.ac.pg";

    const faculty =
        facultySelect.value;

    const course =
        courseSelect.value;

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // ==========================
    // VALIDATE STUDENT ID
    // ==========================
    if (!/^2\d{5}$/.test(studentID)) {

        message.innerText =
            "Student ID must start with 2 and be 6 digits";

        message.style.color = "red";

        return;
    }


    // ==========================
    // VALIDATE PASSWORD
    // ==========================
    if (password !== confirmPassword) {

        message.innerText =
            "Passwords do not match";

        message.style.color = "red";

        return;
    }


    // ==========================
    // VALIDATE FACULTY
    // ==========================
    if (faculty === "") {

        message.innerText =
            "Please select a faculty";

        message.style.color = "red";

        return;
    }


    // ==========================
    // VALIDATE COURSE
    // ==========================
    if (course === "") {

        message.innerText =
            "Please select a department";

        message.style.color = "red";

        return;
    }


    try {

        message.innerText =
            "Creating account...";

        message.style.color = "blue";


        // ==========================
        // CREATE AUTH ACCOUNT
        // ==========================
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            userCredential.user;


        // ==========================
        // SAVE TO REALTIME DATABASE
        // ==========================
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


        // SUCCESS MESSAGE
        message.innerText =
            "Account created successfully!";

        message.style.color = "green";


        // RESET FORM
        form.reset();

        emailInput.value = "";

        courseSelect.innerHTML =
            '<option value="">Select Department</option>';


    } catch (error) {

        console.error(error);

        message.innerText =
            error.message;

        message.style.color = "red";
    }
});