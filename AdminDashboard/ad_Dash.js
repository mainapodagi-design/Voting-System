import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

/* FIREBASE */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* SUPER ADMIN */
const SUPER_ADMIN = {
  name: "Malachai Mainapo",
  username: "240461",
  email: "240461@student.dwu.ac.pg"
};

/* REFS */
const candidatesRef = ref(db, "candidates");
const adminsRef = ref(db, "admins");

/* INPUTS */
const firstname = document.getElementById("firstname");
const surname = document.getElementById("surname");
const position = document.getElementById("position");
const quote = document.getElementById("quote");
const imageUpload = document.getElementById("imageUpload");
const previewImg = document.getElementById("previewImg");

const candidateList = document.getElementById("candidateList");
const adminList = document.getElementById("adminList");

/* POSITIONS */
const positions = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Sports Minister",
  "Welfare Officer"
];

positions.forEach(p => {
  const opt = document.createElement("option");
  opt.value = p;
  opt.textContent = p;
  position.appendChild(opt);
});

/* IMAGE */
let imageData = "";

imageUpload.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = e => {
    imageData = e.target.result;
    previewImg.src = imageData;
  };

  reader.readAsDataURL(file);
});

/* ADD CANDIDATE */
window.addCandidate = function () {
  const newRef = push(ref(db, `candidates/${position.value}`));

  set(newRef, {
    firstname: firstname.value,
    surname: surname.value,
    quote: quote.value,
    image: imageData,
    createdAt: Date.now()
  });

  firstname.value = "";
  surname.value = "";
  quote.value = "";
  imageUpload.value = "";
};

/* LOAD CANDIDATES */
onValue(candidatesRef, snap => {
  candidateList.innerHTML = "";

  snap.forEach(pos => {

    const block = document.createElement("div");
    block.innerHTML = `<h4>${pos.key}</h4>`;

    Object.entries(pos.val() || {}).forEach(([id, data]) => {

      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <strong>${data.firstname} ${data.surname}</strong><br>
        <small>${data.quote}</small>

        <div class="actions">
          <button class="delete" onclick="deleteCandidate('${pos.key}','${id}')">Delete</button>
        </div>
      `;

      block.appendChild(div);
    });

    candidateList.appendChild(block);
  });
});

/* DELETE */
window.deleteCandidate = function (pos, id) {
  remove(ref(db, `candidates/${pos}/${id}`));
};

/* ADD ADMIN */
window.addAdmin = function () {
  const name = prompt("Admin Name");
  const username = prompt("Username");
  const email = prompt("Email");

  if (!name || !username || !email) return;

  const newAdmin = push(adminsRef);

  set(newAdmin, {
    name,
    username,
    email,
    createdAt: Date.now()
  });
};

/* LOAD ADMINS */
onValue(adminsRef, snap => {
  adminList.innerHTML = "";

  const superDiv = document.createElement("div");
  superDiv.className = "item";
  superDiv.innerHTML = `
    <strong>👑 SUPER ADMIN</strong><br>
    ${SUPER_ADMIN.name}<br>
    ${SUPER_ADMIN.username}<br>
    ${SUPER_ADMIN.email}
  `;

  adminList.appendChild(superDiv);

  snap.forEach(child => {
    const data = child.val();

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <strong>${data.name}</strong><br>
      ${data.username}<br>
      ${data.email}

      <div class="actions">
        <button class="delete" onclick="removeAdmin('${child.key}')">Remove</button>
      </div>
    `;

    adminList.appendChild(div);
  });
});

/* REMOVE ADMIN */
window.removeAdmin = function (id) {
  remove(ref(db, "admins/" + id));
};

/* =========================
   NAVIGATION SYSTEM (FIX)
========================= */
const navLinks = document.querySelectorAll("nav a[data-page]");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
  link.addEventListener("click", () => {

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.dataset.page;

    pages.forEach(p => p.classList.remove("active-page"));

    document.getElementById(target).classList.add("active-page");
  });
});