let editingProjectId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  fetchProjects();

  document
    .getElementById('createProjectBtn')
    .addEventListener('click', handleSubmit);

 
  document.getElementById('projects').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
      editProject(editBtn.dataset.id);
    }

    if (deleteBtn) {
      deleteProject(deleteBtn.dataset.id);
    }
  });
});


async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();

  const ownerSelect = document.getElementById('owner');
  const memberSelect = document.getElementById('members');

  ownerSelect.innerHTML = '<option value="">Select Owner</option>';
  memberSelect.innerHTML = '';

  users.forEach(user => {
    ownerSelect.innerHTML += `<option value="${user._id}">${user.name}</option>`;
    memberSelect.innerHTML += `<option value="${user._id}">${user.name}</option>`;
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

        <button class="edit-btn" data-id="${project._id}">
          Edit
        </button>

        <button class="delete-btn" data-id="${project._id}">
          Delete
        </button>
      </div>
      <hr/>
    `;
  });
}


async function handleSubmit() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const owner = document.getElementById('owner').value;
  const status = document.getElementById('status').value;

  const membersSelect = document.getElementById('members');
  const members = Array.from(membersSelect.selectedOptions)
    .map(option => option.value);

  const method = editingProjectId ? 'PUT' : 'POST';
  const url = editingProjectId
    ? `/api/projects/${editingProjectId}`
    : '/api/projects';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      owner,
      members,
      status
    })
  });

  editingProjectId = null;
  document.getElementById('createProjectBtn').innerText = 'Create Project';
  clearForm();
  fetchProjects();
}


async function editProject(projectId) {
  const res = await fetch(`/api/projects/${projectId}`);
  const project = await res.json();

  document.getElementById('name').value = project.name;
  document.getElementById('description').value = project.description;
  document.getElementById('owner').value = project.owner?._id || '';
  document.getElementById('status').value = project.status;

  const memberSelect = document.getElementById('members');
  Array.from(memberSelect.options).forEach(option => {
    option.selected = project.members.some(
      member => member._id === option.value
    );
  });

  editingProjectId = projectId;
  document.getElementById('createProjectBtn').innerText = 'Update Project';
}


async function deleteProject(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  await fetch(`/api/projects/${projectId}`, {
    method: 'DELETE'
  });

  fetchProjects();
}


function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('description').value = '';
}