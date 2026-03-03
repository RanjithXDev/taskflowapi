document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  fetchProjects();

  document
    .getElementById('createProjectBtn')
    .addEventListener('click', createProject);
});

async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();

  const ownerSelect = document.getElementById('owner');
  const memberSelect = document.getElementById('members');

  ownerSelect.innerHTML = '<option value="">Select Owner</option>';
  memberSelect.innerHTML = '';

  users.forEach(user => {
    ownerSelect.innerHTML += `
      <option value="${user._id}">${user.name}</option>
    `;

    memberSelect.innerHTML += `
      <option value="${user._id}">${user.name}</option>
    `;
  });
}

async function fetchProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();

  const container = document.getElementById('projects');
  container.innerHTML = '';

  projects.forEach(project => {
    container.innerHTML += `
      <div class="project-card">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <p><strong>Owner:</strong> ${project.owner?.name}</p>
        <p><strong>Status:</strong> ${project.status}</p>
      </div>
      <hr/>
    `;
  });
}

async function createProject() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const owner = document.getElementById('owner').value;
  const status = document.getElementById('status').value;

  const membersSelect = document.getElementById('members');
  const members = Array.from(membersSelect.selectedOptions)
    .map(option => option.value);

  await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      owner,
      members,
      status
    })
  });

  fetchProjects();
}