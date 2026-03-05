let editingProjectId = null;

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
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

      if (editBtn) {
        editProject(editBtn.dataset.id);
      }

      if (deleteBtn) {
        deleteProject(deleteBtn.dataset.id);
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

    container.innerHTML = "";

    projects.forEach(project => {

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

        </div>

        <hr/>

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