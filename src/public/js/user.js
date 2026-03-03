document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  const createBtn = document.getElementById('createBtn');
  createBtn.addEventListener('click', createUser);
});

async function fetchUsers() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();

    const container = document.getElementById('users');
    container.innerHTML = '';

    users.forEach(user => {

      const avatarHtml = user.avatar
        ? `<img src="${user.avatar}" alt="avatar" class="avatar-img">`
        : `<div class="avatar-letter">${user.name.charAt(0).toUpperCase()}</div>`;

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
        </div>
      `;
    });

  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

async function createUser() {
  const errorDiv = document.getElementById('error');
  errorDiv.innerText = '';

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const avatar = document.getElementById('avatar').value;

  if (!name || !email || !password) {
    errorDiv.innerText = "Name, Email and Password are required.";
    return;
  }

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, avatar })
    });

    const data = await res.json();

    if (!res.ok) {
      errorDiv.innerText = data.message || "Error creating user.";
      return;
    }

    // Reset fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('avatar').value = '';

    fetchUsers();

  } catch (err) {
    console.error('Error creating user:', err);
  }
}