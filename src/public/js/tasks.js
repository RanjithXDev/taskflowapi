let editingTaskId = null;
let currentPage = 1;

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {

  loadUsers();
  loadProjects();
  fetchTasks();

  document
    .getElementById("createTaskBtn")
    .addEventListener("click", handleSubmit);

  document
    .getElementById("tasks")
    .addEventListener("click", (e) => {

      const editBtn = e.target.closest(".edit-btn");
      const deleteBtn = e.target.closest(".delete-btn");

      if (editBtn) {
        editTask(editBtn.dataset.id);
      }

      if (deleteBtn) {
        deleteTask(deleteBtn.dataset.id);
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

    const select = document.getElementById("assignee");

    select.innerHTML = '<option value="">Select Assignee</option>';

    users.forEach(user => {

      select.innerHTML += `
        <option value="${user._id}">
          ${user.name}
        </option>
      `;

    });

  } catch (err) {
    console.error("Error loading users:", err);
  }

}


async function loadProjects() {

  try {

    const res = await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const projects = await res.json();

    const select = document.getElementById("project");

    select.innerHTML = '<option value="">Select Project</option>';

    projects.forEach(project => {

      select.innerHTML += `
        <option value="${project._id}">
          ${project.name}
        </option>
      `;

    });

  } catch (err) {
    console.error("Error loading projects:", err);
  }

}


async function fetchTasks(page = 1) {

  try {

    currentPage = page;

    const res = await fetch(`/api/tasks?page=${page}&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();

    const tasks = result.data || result;

    const container = document.getElementById("tasks");

    container.innerHTML = "";

    tasks.forEach(task => {

      container.innerHTML += `

        <div class="task-card">

          <h3>${task.title}</h3>

          <p>${task.description || ""}</p>

          <p>
            <strong>Status:</strong> ${task.status}
          </p>

          <p>
            <strong>Priority:</strong> ${task.priority}
          </p>

          <p>
            <strong>Assignee:</strong> ${task.assignee?.name || ""}
          </p>

          <p>
            <strong>Project:</strong> ${task.project?.name || ""}
          </p>

          <div style="margin-top:10px">

            <button class="edit-btn" data-id="${task._id}">
              Edit
            </button>

            <button class="delete-btn" data-id="${task._id}">
              Delete
            </button>

          </div>

        </div>

        <hr/>

      `;

    });

    renderPagination(result.pagination);

  } catch (err) {

    console.error("Error fetching tasks:", err);

  }

}


async function handleSubmit() {

  try {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;
    const priority = document.getElementById("priority").value;
    const assignee = document.getElementById("assignee").value;
    const project = document.getElementById("project").value;

    const tags = document
      .getElementById("tags")
      .value
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    const dueDate = document.getElementById("dueDate").value;

    const method = editingTaskId ? "PUT" : "POST";

    const url = editingTaskId
      ? `/api/tasks/${editingTaskId}`
      : "/api/tasks";

    const res = await fetch(url, {

      method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

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

    if (!res.ok) {

      const error = await res.json();

      alert(error.message || "Operation failed");

      return;

    }

    editingTaskId = null;

    document.getElementById("createTaskBtn")
      .innerText = "Create Task";

    clearForm();

    fetchTasks(currentPage);

  } catch (err) {

    console.error("Error submitting task:", err);

  }

}


async function editTask(taskId) {

  try {

    const res = await fetch(`/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const task = await res.json();

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("status").value = task.status;
    document.getElementById("priority").value = task.priority;
    document.getElementById("assignee").value = task.assignee?._id || "";
    document.getElementById("project").value = task.project?._id || "";
    document.getElementById("tags").value = task.tags?.join(", ") || "";

    document.getElementById("dueDate").value =
      task.dueDate ? task.dueDate.split("T")[0] : "";

    editingTaskId = taskId;

    document.getElementById("createTaskBtn")
      .innerText = "Update Task";

    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (err) {

    console.error("Error loading task:", err);

  }

}


async function deleteTask(taskId) {

  if (!confirm("Are you sure you want to delete this task?")) return;

  try {

    const res = await fetch(`/api/tasks/${taskId}`, {

      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`
      }

    });

    if (!res.ok) {

      alert("Failed to delete task");

      return;

    }

    fetchTasks(currentPage);

  } catch (err) {

    console.error("Error deleting task:", err);

  }

}


function renderPagination(pagination) {

  if (!pagination) return;

  let paginationDiv = document.getElementById("pagination");

  if (!paginationDiv) {

    paginationDiv = document.createElement("div");

    paginationDiv.id = "pagination";

    document.body.appendChild(paginationDiv);

  }

  paginationDiv.innerHTML = "";

  for (let i = 1; i <= pagination.totalPages; i++) {

    const btn = document.createElement("button");

    btn.innerText = i;

    btn.disabled = i === pagination.page;

    btn.addEventListener("click", () => fetchTasks(i));

    paginationDiv.appendChild(btn);

  }

}


function clearForm() {

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("tags").value = "";
  document.getElementById("dueDate").value = "";

}