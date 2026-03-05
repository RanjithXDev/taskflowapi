const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

});

async function logout() {

  try {

    await fetch("/api/auth/logout", {
      method: "POST"
    });

  } catch (err) {
    console.error("Logout error:", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";

}