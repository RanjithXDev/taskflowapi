document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadTasks();

  document
    .getElementById('task')
    .addEventListener('change', handleTaskChange);

  document
    .getElementById('createCommentBtn')
    .addEventListener('click', createComment);
});


async function loadUsers() {
  try {
    const res = await fetch('/api/users');
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
    const tasks = await res.json();

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
  const taskId = e.target.value;

  if (!taskId) return;

  await loadComments(taskId);
  await loadParentOptions(taskId);
}


async function loadComments(taskId) {
  try {
    const res = await fetch(`/api/comments/task/${taskId}`);
    const comments = await res.json();

    const container = document.getElementById('comments');
    container.innerHTML = '';

    comments.forEach(comment => {
      const isReply = comment.parent ? 'comment-reply' : '';

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
        </div>
      `;
    });
  } catch (err) {
    console.error('Error loading comments:', err);
  }
}


async function loadParentOptions(taskId) {
  try {
    const res = await fetch(`/api/comments/task/${taskId}`);
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
  const task = document.getElementById('task').value;
  const parent = document.getElementById('parent').value;

  if (!content || !author || !task) {
    alert('Content, Author, and Task are required.');
    return;
  }

  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        author,
        task,
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

    await loadComments(task);
    await loadParentOptions(task);

    alert('Comment added successfully!');

  } catch (err) {
    console.error('Error creating comment:', err);
    alert('Something went wrong.');
  }
}