/* eslint-disable linebreak-style */
// Import the required functions and styles
import './style.css';
import {
  clearCompleted,
  addTask,
  deleteTask,
} from './crud.js';

// Array to store the tasks
let tasks = [];

// Function to update the local storage with the current tasks data
const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to render the tasks on the todo-list element
const renderTasks = (tasks) => {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  // Loop through each task and create the corresponding list item
  tasks.forEach((task) => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    // Create a checkbox to mark the task as completed
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      listItem.className = task.completed ? 'task-item completed' : 'task-item';
      updateLocalStorage();
    });

    // Create a label to display the task description and enable editing
    const label = document.createElement('label');
    const descriptionSpan = document.createElement('span');
    descriptionSpan.innerText = task.description;

    // Create an input field to edit the task description
    const editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.className = 'edit-input';
    editInput.style.display = 'none';
    editInput.value = task.description;
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        descriptionSpan.innerText = editInput.value.trim();
        task.description = editInput.value.trim();
        editInput.style.display = 'none';
        descriptionSpan.style.display = 'inline';
        updateLocalStorage();
      }
    });

    // Add event listeners to enable editing when the label is clicked
    label.appendChild(descriptionSpan);
    label.appendChild(editInput);
    label.addEventListener('click', () => {
      descriptionSpan.style.display = 'none';
      editInput.style.display = 'inline';
      editInput.focus();
    });

    // Create a delete icon and add an event listener to handle task deletion
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash delete-icon';
    deleteIcon.style.display = 'none'; // Hide the delete icon initially
    // eslint-disable-next-line no-unused-vars
    const deleteTaskHandler = (index) => {
      tasks = deleteTask(tasks, index);
      updateLocalStorage();
      renderTasks(tasks);
    };
    deleteIcon.addEventListener('click', () => {
      const taskIndex = tasks.findIndex((t) => t.index === task.index);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        updateLocalStorage();
        renderTasks(tasks);
      }
    });

    // Create an ellipsis icon to show additional options
    const ellipsisIcon = document.createElement('i');
    ellipsisIcon.className = 'fas fa-ellipsis-v ellipsis-icon';
    ellipsisIcon.addEventListener('click', () => {
      deleteIcon.style.display = 'inline'; // Show the delete icon
      ellipsisIcon.style.display = 'none'; // Hide the ellipsis icon
    });

    // Append all elements to the list item and the list item to the todo-list
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(ellipsisIcon);
    listItem.appendChild(deleteIcon);
    todoList.appendChild(listItem);
  });
};

// Function to load tasks from local storage and render them on the page
const refreshTasks = () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks(tasks);
  }
};

// Event listener for the refresh icon to re-render the tasks on click
const refreshIcon = document.getElementById('refresh-icon');
refreshIcon.addEventListener('click', () => {
  renderTasks(tasks);
});

// Event listener for the add icon to add a new task on click
const addIcon = document.getElementById('add-icon');
addIcon.addEventListener('click', () => {
  const taskInput = document.getElementById('task-input');
  const description = taskInput.value.trim();
  if (description) {
    tasks = addTask(tasks, description);
    taskInput.value = '';
    updateLocalStorage();
    renderTasks(tasks);
  }
});

// Event listener for the clear button to remove completed tasks
const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', () => {
  tasks = clearCompleted(tasks);
  updateLocalStorage();
  renderTasks(tasks);
});

// Call refreshTasks on page load to load and render tasks from local storage
window.addEventListener('load', refreshTasks);

// Render the initial tasks on page load
renderTasks(tasks);
