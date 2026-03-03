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
      container.innerHTML += `
        <div class="user-card">
          <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
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

  if (!name || !email || !password) {
    errorDiv.innerText = "All fields are required.";
    return;
  }

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      errorDiv.innerText = data.message || "Error creating user.";
      return;
    }

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    fetchUsers();

  } catch (err) {
    console.error('Error creating user:', err);
  }
}