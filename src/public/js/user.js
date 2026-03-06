let editingUserId = null;

const token = localStorage.getItem("token");

let currentUser = null;

if (!token) {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", async () => {

  await getCurrentUser();
  fetchUsers();

  document
    .getElementById("createBtn")
    .addEventListener("click", createOrUpdateUser);

  document
    .getElementById("users")
    .addEventListener("click", (e) => {

      const editBtn = e.target.closest(".edit-btn");
      const deleteBtn = e.target.closest(".delete-btn");

      if (editBtn) editUser(editBtn.dataset.id);
      if (deleteBtn) deleteUser(deleteBtn.dataset.id);

    });

});



async function fetchUsers() {

  try {

    const res = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const users = await res.json();

    const container = document.getElementById("users");
    container.innerHTML = "";

    users.forEach(user => {

      const avatarHtml = user.avatar
        ? `<img src="/api/users/avatar/${user.avatar.split("/").pop()}" class="avatar-img">`
        : `<div class="avatar-letter">${user?.name?.charAt(0) || "U"}</div>`;

      container.innerHTML += `
        <div class="user-card">

          <div class="avatar">
            ${avatarHtml}
          </div>

          <div class="user-info">
            <strong>${user?.name || "Unknown"}</strong>
            <p>${user?.email || ""}</p>
            <span class="role ${user.role}">${user.role}</span>
          </div>

          <div class="user-actions">

            ${
              currentUser && currentUser.role === "admin"
              ? `<button class="edit-btn" data-id="${user._id}">Edit</button>`
              : ""
            }

            ${
              currentUser && currentUser.role === "admin"
              ? `<button class="delete-btn" data-id="${user._id}">Delete</button>`
              : ""
            }

          </div>

        </div>
      `;

    });

  } catch (err) {
    console.error("Error fetching users:", err);
  }

}



async function createOrUpdateUser() {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const avatarFile = document.getElementById("avatarFile").files[0];

  const method = editingUserId ? "PUT" : "POST";

  const url = editingUserId
    ? `/api/users/${editingUserId}`
    : `/api/users`;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("role", role);

  if (!editingUserId) {
    formData.append("email", email);
    formData.append("password", password);
  }

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  try {

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Operation failed");
      return;
    }

    clearForm();
    editingUserId = null;

    document.getElementById("createBtn").innerText = "Create User";

    fetchUsers();

  } catch (err) {
    console.error("Error saving user:", err);
  }

}



async function editUser(userId) {

  try {

    const res = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = await res.json();

    const user = users.find(u => u._id === userId);

    if (!user) return;

    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("role").value = user.role || "user";

    editingUserId = userId;

    document.getElementById("createBtn").innerText = "Update User";

  } catch (err) {
    console.error("Error loading user:", err);
  }

}



async function deleteUser(userId) {

  if (!confirm("Delete this user?")) return;

  try {

    await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchUsers();

  } catch (err) {
    console.error("Error deleting user:", err);
  }

}



function clearForm() {

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  const avatarInput = document.getElementById("avatarFile");
  if (avatarInput) avatarInput.value = "";

}



function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";

}



async function getCurrentUser(){

  try {

    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    currentUser = await res.json();

  } catch (err) {
    console.error("Error getting current user:", err);
  }

}