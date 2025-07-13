const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const pendingTasksList = document.getElementById('pending-tasks');
const completedTasksList = document.getElementById('completed-tasks');

const editModal = document.getElementById('edit-modal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('edit-form');
const editTaskIdInput = document.getElementById('edit-task-id');
const editTaskInput = document.getElementById('edit-task-input');

let tasks = [];

window.onload = function() {
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  renderTasks();
};

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }

    li.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <small>Created At: ${new Date(task.createdAt).toLocaleString()}</small>
        ${task.completed ? `<br><small>Completed At: ${new Date(task.completedAt).toLocaleString()}</small>` : ''}
      </div>
      <div class="task-actions">
        ${!task.completed ? `<button class="complete-btn" data-id="${task.id}">Complete</button>` : ''}
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    if (task.completed) {
      completedTasksList.appendChild(li);
    } else {
      pendingTasksList.appendChild(li);
    }
  });
}

taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = taskInput.value.trim();
  const description = prompt('Enter task description:', '');
  
  if (title === '') {
    alert('Task title cannot be empty!');
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    createdAt: new Date(),
    completed: false,
    completedAt: null
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

document.addEventListener('click', function(e) {
  const target = e.target;

  if (target.classList.contains('complete-btn')) {
    const taskId = parseInt(target.getAttribute('data-id'));
    completeTask(taskId);
  }

  if (target.classList.contains('edit-btn')) {
    const taskId = parseInt(target.getAttribute('data-id'));
    openEditModal(taskId);
  }

  if (target.classList.contains('delete-btn')) {
    const taskId = parseInt(target.getAttribute('data-id'));
    deleteTask(taskId);
  }
});

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    task.completedAt = new Date();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    editTaskIdInput.value = task.id;
    editTaskInput.value = task.title;
    editModal.style.display = 'block';
  }
}

closeButton.addEventListener('click', function() {
  editModal.style.display = 'none';
});

window.addEventListener('click', function(e) {
  if (e.target == editModal) {
    editModal.style.display = 'none';
  }
});

editForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = parseInt(editTaskIdInput.value);
  const updatedTitle = editTaskInput.value.trim();

  if (updatedTitle === '') {
    alert('Task title cannot be empty!');
    return;
  }

  const task = tasks.find(t => t.id === id);
  if (task) {
    task.title = updatedTitle;
    saveTasks();
    renderTasks();
    editModal.style.display = 'none';
  }
});
