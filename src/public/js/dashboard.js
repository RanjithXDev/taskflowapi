const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Initialize dashboard
  loadDashboardStats();
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

});




async function loadDashboardStats() {
  try {
    
    const [projectsRes, tasksRes, usersRes, commentsRes] = await Promise.all([
      fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/comments", { headers: { Authorization: `Bearer ${token}` } })
    ]);

    const projects = await projectsRes.json();
    const tasks = await tasksRes.json();
    const users = await usersRes.json();
    const comments = await commentsRes.json();

    updateStats(projects, tasks, users, comments);

  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}

function updateStats(projects, tasks, users, comments) {
  
  const projectCount = Array.isArray(projects) ? projects.length : (projects.data?.length || 0);
  const taskCount = Array.isArray(tasks) ? tasks.length : (tasks.data?.length || 0);
  const userCount = Array.isArray(users) ? users.length : 0;
  const commentCount = Array.isArray(comments) ? comments.length : (comments.data?.length || 0);

  updateElement("totalProjects", projectCount);
  updateElement("totalTasks", taskCount);
  updateElement("totalUsers", userCount);
  updateElement("totalComments", commentCount);

  updateElement("badge-projects", `${projectCount} project${projectCount !== 1 ? 's' : ''}`);
  updateElement("badge-tasks", `${taskCount} task${taskCount !== 1 ? 's' : ''}`);
  updateElement("badge-users", `${userCount} member${userCount !== 1 ? 's' : ''}`);
  updateElement("badge-comments", `${commentCount} discussion${commentCount !== 1 ? 's' : ''}`);

  animateStats();
}

function updateElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element && element.textContent !== String(value)) {
    element.classList.add("stat-update");
    element.textContent = value;
    
    setTimeout(() => {
      element.classList.remove("stat-update");
    }, 300);
  }
}

function animateStats() {
  const statCards = document.querySelectorAll(".stat-card");
  
  statCards.forEach((card, index) => {
    if (card.style.animation) return;
    
    card.style.animation = "none";
    setTimeout(() => {
      card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s forwards`;
    }, 10);
  });
}

async function logout() {

  try {

    await fetch("/api/auth/logout", {
      method: "POST"
    });

  } catch (err) {
    console.error("Logout error:", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";

}

const style = document.createElement("style");
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stat-update {
    animation: pulse 0.3s ease-out;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);