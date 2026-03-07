let editingProjectId = null;

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

// Function to decode JWT and get current user ID
function getCurrentUserId() {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.userId || payload.id || payload._id;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}


document.addEventListener("DOMContentLoaded", () => {

  loadUsers();

  fetchProjects();

  document
    .getElementById("createProjectBtn")
    .addEventListener("click", handleSubmit);

  document
    .getElementById("projects")
    .addEventListener("click", (e) => {

      const editBtn = e.target.closest(".edit-btn");
const deleteBtn = e.target.closest(".delete-btn");
const reportBtn = e.target.closest(".report-btn");
const csvBtn = e.target.closest(".csv-btn");

if (editBtn) {
  editProject(editBtn.dataset.id);
}

if (deleteBtn) {
  deleteProject(deleteBtn.dataset.id);
}

if (reportBtn) {
  downloadReport(reportBtn.dataset.id);
}

if (csvBtn) {
  exportCSV(csvBtn.dataset.id);
}

    });

});



async function loadUsers() {

  try {

    const res = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = await res.json();

    const ownerSelect = document.getElementById("owner");
    const memberSelect = document.getElementById("members");

    ownerSelect.innerHTML = '<option value="">Select Owner</option>';
    memberSelect.innerHTML = "";

    users.forEach(user => {

      ownerSelect.innerHTML += `
        <option value="${user._id}">
          ${user.name}
        </option>
      `;

      memberSelect.innerHTML += `
        <option value="${user._id}">
          ${user.name}
        </option>
      `;

    });

  } catch (err) {
    console.error("Error loading users:", err);
  }

}



async function fetchProjects() {

  try {

    const res = await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const projects = await res.json();

    const container = document.getElementById("projects");
    const currentUserId = getCurrentUserId();

    container.innerHTML = "";

    projects.forEach(project => {

      // Check if current user is the project owner
      const isOwner = project.owner?._id === currentUserId || project.owner?.id === currentUserId || project.owner === currentUserId;

      // Build edit/delete buttons only if user is owner
      const actionButtons = isOwner ? `
        <button
          class="edit-btn"
          data-id="${project._id}">
          Edit
        </button>

        <button
          class="delete-btn"
          data-id="${project._id}">
          Delete
        </button>
      ` : `<p style="color: #999; font-size: 0.9rem;">You don't have permission to edit/delete this project</p>`;

      container.innerHTML += `

        <div class="project-card">

          <h3>${project.name}</h3>

          <p>${project.description || ""}</p>

          <p>
            <strong>Owner:</strong>
            ${project.owner?.name || "Unknown"}
          </p>

          <p>
            <strong>Status:</strong>
            ${project.status}
          </p>

          ${actionButtons}

          <button class="report-btn"
          data-id="${project._id}">
          Download Report
          </button>

          <button class="csv-btn"
          data-id="${project._id}">
          Export CSV
          </button>

        </div>

      `;

    });

  } catch (err) {
    console.error("Error fetching projects:", err);
  }

}



async function handleSubmit() {

  const name = document.getElementById("name").value;

  const description =
    document.getElementById("description").value;

  const owner =
    document.getElementById("owner").value;

  const status =
    document.getElementById("status").value;

  const membersSelect =
    document.getElementById("members");

  const members = Array
    .from(membersSelect.selectedOptions)
    .map(option => option.value);

  const method =
    editingProjectId ? "PUT" : "POST";

  const url =
    editingProjectId
      ? `/api/projects/${editingProjectId}`
      : "/api/projects";

  try {

    await fetch(url, {

      method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        name,
        description,
        owner,
        members,
        status
      })

    });

    editingProjectId = null;

    document.getElementById("createProjectBtn")
      .innerText = "Create Project";

    clearForm();

    fetchProjects();

  } catch (err) {

    console.error("Error saving project:", err);

  }

}



async function editProject(projectId) {

  try {

    const res = await fetch(
      `/api/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const project = await res.json();

    document.getElementById("name").value =
      project.name;

    document.getElementById("description").value =
      project.description;

    document.getElementById("owner").value =
      project.owner?._id || "";

    document.getElementById("status").value =
      project.status;

    const memberSelect =
      document.getElementById("members");

    Array.from(memberSelect.options).forEach(option => {

      option.selected =
        project.members.some(
          member => member._id === option.value
        );

    });

    editingProjectId = projectId;

    document.getElementById("createProjectBtn")
      .innerText = "Update Project";

  } catch (err) {

    console.error("Error editing project:", err);

  }

}
async function downloadReport(projectId) {

  fetch(`/api/projects/${projectId}/report`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => response.blob())
  .then(blob => {

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `project-${projectId}-report.pdf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

  });

}

async function exportCSV(projectId) {

  fetch(`/api/projects/${projectId}/export?format=csv`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => response.blob())
  .then(blob => {

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `project-${projectId}-tasks.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();

  });

}



async function deleteProject(projectId) {

  if (!confirm("Are you sure you want to delete this project?")) return;

  try {

    await fetch(`/api/projects/${projectId}`, {

      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`
      }

    });

    fetchProjects();

  } catch (err) {

    console.error("Error deleting project:", err);

  }

}



function clearForm() {

  document.getElementById("name").value = "";

  document.getElementById("description").value = "";

  document.getElementById("owner").value = "";

  document.getElementById("status").value = "";

}