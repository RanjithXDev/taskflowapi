let currentTaskId = null;
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
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadTasks();

  document
    .getElementById('task')
    .addEventListener('change', handleTaskChange);

  document
    .getElementById('createCommentBtn')
    .addEventListener('click', createComment);

  
  document.getElementById('comments').addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-comment-btn');
    if (!deleteBtn) return;

    const commentId = deleteBtn.dataset.id;

    if (!confirm('Delete this comment?')) return;

    try {
      await fetch(`/api/tasks/${currentTaskId}/comments/${commentId}`, {
        method: 'DELETE'
      });

      loadComments(currentTaskId);
      loadParentOptions(currentTaskId);

    } catch (err) {
      console.error('Error deleting comment:', err);
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

    const select = document.getElementById('author');
    select.innerHTML = '<option value="">Select Author</option>';

    users.forEach(user => {
      select.innerHTML += `
        <option value="${user._id}">
          ${user.name}
        </option>
      `;
    });

  } catch (err) {
    console.error('Error loading users:', err);
  }
}


async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const result = await res.json();
    const tasks = result.data || result;

    const select = document.getElementById('task');
    select.innerHTML = '<option value="">Select Task</option>';

    tasks.forEach(task => {
      select.innerHTML += `
        <option value="${task._id}">
          ${task.title}
        </option>
      `;
    });

  } catch (err) {
    console.error('Error loading tasks:', err);
  }
}


async function handleTaskChange(e) {
  currentTaskId = e.target.value;

  if (!currentTaskId) return;

  await loadComments(currentTaskId);
  await loadParentOptions(currentTaskId);
}


async function loadComments(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/comments`);
    const comments = await res.json();

    const container = document.getElementById('comments');
    const currentUserId = getCurrentUserId();

    container.innerHTML = '';

    comments.forEach(comment => {
      const isReply = comment.parent ? 'comment-reply' : '';

      // Check if current user is the comment author - try multiple field names
      const isAuthor =
        comment.author?._id === currentUserId ||
        comment.author?.id === currentUserId ||
        comment.author === currentUserId ||
        comment.createdBy?._id === currentUserId ||
        comment.createdBy?.id === currentUserId ||
        comment.createdBy === currentUserId ||
        comment.owner?._id === currentUserId ||
        comment.owner?.id === currentUserId ||
        comment.owner === currentUserId ||
        comment.userId === currentUserId;

      console.log("Current User ID:", currentUserId);
      console.log("Comment author:", comment.author);
      console.log("Comment createdBy:", comment.createdBy);
      console.log("Comment owner:", comment.owner);
      console.log("Comment userId:", comment.userId);
      console.log("Is Author:", isAuthor, "Comment ID:", comment._id);

      // Build delete button only if user is author
      const deleteButton = isAuthor ? `
        <button class="delete-comment-btn" data-id="${comment._id}">
          Delete
        </button>
      ` : '';

      container.innerHTML += `
        <div class="comment-card ${isReply}">
          <div class="comment-header">
            <span class="comment-author">
              ${comment.author?.name || 'Unknown'}
            </span>
            <span class="comment-date">
              ${new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          <div class="comment-content">
            ${comment.content}
          </div>

          ${deleteButton}
        </div>
      `;
    });

  } catch (err) {
    console.error('Error loading comments:', err);
  }
}


async function loadParentOptions(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/comments`);
    const comments = await res.json();

    const select = document.getElementById('parent');
    select.innerHTML = '<option value="">No Parent (Top Level)</option>';

    comments.forEach(comment => {
      select.innerHTML += `
        <option value="${comment._id}">
          ${comment.content.substring(0, 40)}
        </option>
      `;
    });

  } catch (err) {
    console.error('Error loading parent options:', err);
  }
}


async function createComment() {
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value;
  const parent = document.getElementById('parent').value;

  if (!content || !author || !currentTaskId) {
    alert('Content, Author, and Task are required.');
    return;
  }

  try {
    const res = await fetch(`/api/tasks/${currentTaskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        author,
        task: currentTaskId,
        parent: parent || null
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to create comment.');
      return;
    }

    document.getElementById('content').value = '';
    document.getElementById('parent').value = '';

    await loadComments(currentTaskId);
    await loadParentOptions(currentTaskId);

  } catch (err) {
    console.error('Error creating comment:', err);
    alert('Something went wrong.');
  }
}