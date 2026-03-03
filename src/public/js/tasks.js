document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadProjects();
  fetchTasks();

  document.getElementById('createTaskBtn')
    .addEventListener('click', createTask);
});

async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();

  const select = document.getElementById('assignee');
  select.innerHTML = '<option value="">Select Assignee</option>';

  users.forEach(user => {
    select.innerHTML += `
      <option value="${user._id}">
        ${user.name}
      </option>
    `;
  });
}

async function loadProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();

  const select = document.getElementById('project');
  select.innerHTML = '<option value="">Select Project</option>';

  projects.forEach(project => {
    select.innerHTML += `
      <option value="${project._id}">
        ${project.name}
      </option>
    `;
  });
}

async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();

  const container = document.getElementById('tasks');
  container.innerHTML = '';

  tasks.forEach(task => {
    container.innerHTML += `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Assignee: ${task.assignee?.name}</p>
        <p>Project: ${task.project?.name}</p>
        <p>Status: ${task.status}</p>
        <p>Priority: ${task.priority}</p>
      </div>
      <hr/>
    `;
  });
}

async function createTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;
  const priority = document.getElementById('priority').value;
  const assignee = document.getElementById('assignee').value;
  const project = document.getElementById('project').value;
  const tags = document.getElementById('tags').value
    .split(',')
    .map(t => t.trim());
  const dueDate = document.getElementById('dueDate').value;

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
      assignee,
      project,
      tags,
      dueDate
    })
  });

  fetchTasks();
}