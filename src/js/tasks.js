/**
 * Task Management Module
 * Handles all task-related operations: creating, updating, deleting, and organizing tasks
 */

import { saveState } from './storage.js';

// Task data structure
let tasks = [];
let currentTaskId = 0;

/**
 * Initialize the task management module
 */
export function initTaskManagement() {
    // Set up event listeners for task-related actions
    setupTaskEventListeners();
    
    // For development, if no tasks exist, create sample tasks
    if (tasks.length === 0) {
        createSampleTasks();
    }
    
    // Render tasks to the UI
    renderTasks();
}

/**
 * Set up event listeners for task-related UI elements
 */
function setupTaskEventListeners() {
    // New task input
    const newTaskInput = document.querySelector('.new-task-input input');
    const addTaskBtn = document.querySelector('.add-task-btn');
    
    // Add task on Enter key press
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            addTask(this.value.trim());
            this.value = '';
        }
    });
    
    // Add task on add button click
    addTaskBtn.addEventListener('click', () => {
        if (newTaskInput.value.trim() !== '') {
            addTask(newTaskInput.value.trim());
            newTaskInput.value = '';
        }
    });
    
    // Task checkboxes (for completed tasks)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.task-checkbox')) {
            const taskElement = e.target.closest('.task');
            if (taskElement) {
                const taskId = taskElement.dataset.taskId;
                toggleTaskCompletion(taskId);
            }
        }
    });
}

/**
 * Add a new task
 * @param {string} name - The name of the task
 * @param {Object} options - Additional task options
 */
function addTask(name, options = {}) {
    const newTask = {
        id: Date.now(), // Use timestamp as unique ID
        name,
        completed: false,
        priority: options.priority || 0,
        project: options.project || 'Inbox',
        dueDate: options.dueDate || null,
        estimatedTime: options.estimatedTime || 25, // minutes
        subtasks: options.subtasks || [],
        notes: options.notes || '',
        tags: options.tags || [],
        pomodoroQuantity: options.pomodoroQuantity || { completed: 0, total: 1 },
        ...options
    };
    
    tasks.push(newTask);
    saveState({ tasks });
    renderTasks();
}

/**
 * Toggle task completion status
 * @param {string} taskId - The ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (task) {
        task.completed = !task.completed;
        saveState({ tasks });
        renderTasks();
    }
}

/**
 * Update an existing task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} updatedFields - The fields to update
 */
function updateTask(taskId, updatedFields) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedFields };
        saveState({ tasks });
        renderTasks();
    }
}

/**
 * Delete a task
 * @param {string} taskId - The ID of the task to delete
 */
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id != taskId);
    saveState({ tasks });
    renderTasks();
}

/**
 * Render all tasks to the UI, grouped by project
 */
function renderTasks() {
    // This is a placeholder for the actual implementation
    // In a real application, this would render the tasks to the UI
    // grouped by project and sorted according to priority
    console.log('Tasks rendered:', tasks);
}

/**
 * Create sample tasks for development
 */
function createSampleTasks() {
    // These sample tasks match the ones shown in the image
    const sampleTasks = [
        {
            id: 1,
            name: 'Organize last week\'s report',
            completed: false,
            priority: 2,
            project: 'Work',
            dueDate: '2019-09-12',
            estimatedTime: 25,
            tags: ['important'],
            pomodoroQuantity: { completed: 0, total: 1 }
        },
        {
            id: 2,
            name: 'Make a PPT of report of the forth season',
            completed: false,
            priority: 2,
            project: 'Work',
            dueDate: '2019-09-12',
            estimatedTime: 100,
            pomodoroQuantity: { completed: 0, total: 4 }
        },
        {
            id: 3,
            name: 'Reading',
            completed: false,
            priority: 2,
            project: 'Study',
            dueDate: '2019-09-12',
            estimatedTime: 50,
            subtasks: [
                { id: 101, name: 'Chapter 1', completed: false },
                { id: 102, name: 'Chapter 2', completed: false }
            ],
            pomodoroQuantity: { completed: 0, total: 2 }
        },
        {
            id: 4,
            name: 'Write reading notes',
            completed: true,
            priority: 1,
            project: 'Study',
            dueDate: '2019-09-12',
            estimatedTime: 25,
            tags: ['Home'],
            pomodoroQuantity: { completed: 1, total: 1 }
        },
        {
            id: 5,
            name: 'Book a flight to Japan',
            completed: false,
            priority: 0,
            project: 'Personal',
            dueDate: '2019-09-12',
            estimatedTime: 15,
            pomodoroQuantity: { completed: 0, total: 1 }
        },
        {
            id: 6,
            name: 'Buy milk in the supermarket',
            completed: false,
            priority: 0,
            project: 'Personal',
            dueDate: '2019-09-12',
            estimatedTime: 10,
            pomodoroQuantity: { completed: 0, total: 1 }
        }
    ];
    
    tasks = sampleTasks;
}
