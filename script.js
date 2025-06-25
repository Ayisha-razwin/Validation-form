
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const taskCounter = document.getElementById('taskCounter');

// Application State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize the application
function init() {
    renderTasks();
    updateCounter();
    setActiveFilter();
    
    // Load with input focused
    taskInput.focus();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
        setActiveFilter();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Core Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateCounter();
    showFeedback('Task added successfully!');
}

function toggleTask(e) {
    const taskId = parseInt(e.target.closest('.task-item').dataset.id);
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
        updateCounter();
        showFeedback(`Task marked as ${task.completed ? 'completed' : 'active'}`);
    }
}

function deleteTask(e) {
    const taskId = parseInt(e.target.closest('.task-item').dataset.id);
    tasks = tasks.filter(task => task.id !== taskId);
    
    saveTasks();
    renderTasks();
    updateCounter();
    showFeedback('Task deleted');
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateCounter();
    showFeedback('Completed tasks cleared');
}

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'list-group-item text-center text-muted';
        emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet!' : 
                                  currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item task-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;

        const taskContent = document.createElement('div');
        taskContent.className = 'form-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', toggleTask);

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.textContent = task.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', deleteTask);

        taskActions.appendChild(deleteBtn);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    });
}

function updateCounter() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
}

function setActiveFilter() {
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showFeedback(message) {
    // Simple feedback - you could enhance this with a toast notification
    console.log(message);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);