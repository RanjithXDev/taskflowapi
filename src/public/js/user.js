let editingUserId = null;

const token = localStorage.getItem('token');


if (!token) {
  window.location.href = '/login';
}

document.addEventListener('DOMContentLoaded', () => {

  fetchUsers();

  document
    .getElementById('createBtn')
    .addEventListener('click', createOrUpdateUser);

  

  document.getElementById('users').addEventListener('click', (e) => {

    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.dataset.id;
      editUser(id);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      deleteUser(id);
    }

  });

});




async function fetchUsers() {

  try {

    const res = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const users = await res.json();

    const container = document.getElementById('users');
    container.innerHTML = '';

    users.forEach(user => {

      const avatarHtml = user.avatar
        ? `<img src="${user.avatar}" class="avatar-img">`
        : `<div class="avatar-letter">${user.name.charAt(0)}</div>`;

      container.innerHTML += `

        <div class="user-card">

          <div class="avatar">
            ${avatarHtml}
          </div>

          <div class="user-info">
            <strong>${user.name}</strong>
            <p>${user.email}</p>
            <span class="role ${user.role}">${user.role}</span>
          </div>

          <div class="user-actions">
            <button class="edit-btn" data-id="${user._id}">Edit</button>
            <button class="delete-btn" data-id="${user._id}">Delete</button>
          </div>

        </div>

      `;

    });

  } catch (err) {
    console.error('Error fetching users:', err);
  }

}



async function createOrUpdateUser() {

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const avatar = document.getElementById('avatar').value;

  const method = editingUserId ? 'PUT' : 'POST';

  const url = editingUserId
    ? `/api/users/${editingUserId}`
    : `/api/users`;

  const body = editingUserId
    ? { name, role }
    : { name, email, password, role, avatar };

  try {

    const res = await fetch(url, {

      method,

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify(body)

    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    clearForm();

    editingUserId = null;

    document.getElementById('createBtn').innerText = "Create User";

    fetchUsers();

  } catch (err) {
    console.error(err);
  }

}



async function editUser(userId) {

  try {

    const res = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = await res.json();

    const user = users.find(u => u._id === userId);

    if (!user) return;

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    document.getElementById('avatar').value = user.avatar || '';

    editingUserId = userId;

    document.getElementById('createBtn').innerText = "Update User";

  } catch (err) {
    console.error(err);
  }

}



async function deleteUser(userId) {

  if (!confirm("Delete this user?")) return;

  try {

    await fetch(`/api/users/${userId}`, {

      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`
      }

    });

    fetchUsers();

  } catch (err) {
    console.error(err);
  }

}




function clearForm() {

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('avatar').value = '';

}




function logout() {

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  window.location.href = '/login';

}