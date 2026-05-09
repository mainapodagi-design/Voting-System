const toggleAdminPassword = document.getElementById("toggleAdminPassword");
const adminPassword = document.getElementById("adminPassword");

toggleAdminPassword.addEventListener("change", function () {
  adminPassword.type = this.checked ? "text" : "password";
});

// Demo only (no backend yet)
document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Admin login clicked (backend not connected)");
});