/**
 * Task Management Module
 * Handles all task-related operations: creating, updating, deleting, and organizing tasks
 */

import { saveState, getState } from './storage.js';
import { updateProgress } from './progress.js';

// Task data structure
let tasks = [];
let currentTaskId = 0;
let selectedTaskId = null;

/**
 * Get the current tasks array
 * @returns {Array} The current tasks
 */
export function getTasks() {
    return tasks;
}

/**
 * Get the currently selected task ID
 * @returns {string|null} The selected task ID
 */
export function getSelectedTaskId() {
    return selectedTaskId;
}

/**
 * Initialize the task management module
 */
export function initTaskManagement() {
    // Load tasks from state
    const state = getState();
    tasks = state.tasks || [];
    
    // Set up event listeners for task-related actions
    setupTaskEventListeners();
    
    // For development, if no tasks exist, create sample tasks
    if (tasks.length === 0) {
        createSampleTasks();
    }
    
    // Render tasks to the UI
    renderTasks();
    
    // Update progress tracking
    updateProgress(tasks);
    
    // Set up click listeners for list items in sidebar
    setupSidebarListeners();
    
    // Set up drag and drop functionality
    setupDragAndDrop();
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
        } else {
            newTaskInput.focus();
        }
    });
    
    // Task checkboxes (for completed tasks)
    document.addEventListener('click', function(e) {
        const taskCheckbox = e.target.closest('.task-checkbox');
        if (taskCheckbox) {
            const taskElement = e.target.closest('.task');
            if (taskElement) {
                const taskId = taskElement.dataset.taskId;
                toggleTaskCompletion(taskId);
            }
        }
    });
    
    // Task selection
    document.addEventListener('click', function(e) {
        const taskElement = e.target.closest('.task');
        if (taskElement && !e.target.closest('.task-checkbox')) {
            const taskId = taskElement.dataset.taskId;
            selectTask(taskId);
        }
    });
    
    // Delete task button
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-task-btn')) {
            if (selectedTaskId) {
                deleteTask(selectedTaskId);
                closeTaskDetails();
            }
        }
    });
    
    // Add subtask button
    const addSubtaskBtn = document.querySelector('.add-subtask-btn');
    if (addSubtaskBtn) {
        addSubtaskBtn.addEventListener('click', () => {
            const subtaskInput = document.createElement('div');
            subtaskInput.classList.add('subtask-input');
            subtaskInput.innerHTML = `
                <input type="text" placeholder="New subtask..." class="new-subtask-input">
                <button class="save-subtask-btn"><i class="fa-solid fa-check"></i></button>
            `;
            
            document.querySelector('.add-subtask').before(subtaskInput);
            
            const input = subtaskInput.querySelector('input');
            input.focus();
            
            // Save subtask on Enter
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    addSubtask(selectedTaskId, this.value.trim());
                    subtaskInput.remove();
                }
            });
            
            // Save subtask on button click
            subtaskInput.querySelector('.save-subtask-btn').addEventListener('click', () => {
                const value = input.value.trim();
                if (value !== '') {
                    addSubtask(selectedTaskId, value);
                    subtaskInput.remove();
                }
            });
        });
    }
    
    // Minimize details button
    const minimizeDetailsBtn = document.querySelector('.minimize-details');
    if (minimizeDetailsBtn) {
        minimizeDetailsBtn.addEventListener('click', closeTaskDetails);
    }
}

/**
 * Set up click listeners for sidebar list items
 */
function setupSidebarListeners() {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all list items
            listItems.forEach(li => li.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update task area header
            const listName = this.querySelector('.list-name').textContent;
            document.querySelector('.task-area-header h1').textContent = listName;
            
            // Filter tasks based on the selected list
            filterTasks(listName);
        });
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
 * Select a task to show its details
 * @param {string} taskId - The ID of the task to select
 */
function selectTask(taskId) {
    selectedTaskId = taskId;
    const task = tasks.find(t => t.id == taskId);
    
    if (!task) return;
    
    // Update task details sidebar
    const taskDetails = document.querySelector('.task-details');
    taskDetails.style.display = 'block';
    
    // Update task title and checkbox
    taskDetails.querySelector('.task-title').textContent = task.name;
    const checkbox = taskDetails.querySelector('.task-checkbox.large i');
    checkbox.className = task.completed ? 'fa-solid fa-check-circle' : 'fa-regular fa-circle';
    
    // Update Pomodoro quantity
    const pomodoroQuantity = taskDetails.querySelector('.pomodoro-quantity .quantity-info');
    pomodoroQuantity.textContent = `${task.pomodoroQuantity?.completed || 0} / ${task.pomodoroQuantity?.total || 0}`;
    
    // Update due date
    const dueDate = taskDetails.querySelector('.due-date');
    dueDate.textContent = task.dueDate ? formatDate(task.dueDate) : 'None';
    
    // Update project
    const projectName = taskDetails.querySelector('.project-name');
    projectName.textContent = task.project || 'Inbox';
    
    // Update subtasks
    const subtasksSection = taskDetails.querySelector('.subtasks-section');
    subtasksSection.innerHTML = ''; // Clear existing subtasks
    
    // Add subtasks if they exist
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
            const subtaskEl = document.createElement('div');
            subtaskEl.classList.add('subtask');
            subtaskEl.dataset.subtaskId = subtask.id;
            
            subtaskEl.innerHTML = `
                <div class="subtask-checkbox"><i class="${subtask.completed ? 'fa-solid fa-check-circle' : 'fa-regular fa-circle'}"></i></div>
                <div class="subtask-name">${subtask.name}</div>
            `;
            
            subtasksSection.appendChild(subtaskEl);
        });
    }
    
    // Add the "Add a subtask" button
    const addSubtaskDiv = document.createElement('div');
    addSubtaskDiv.classList.add('add-subtask');
    addSubtaskDiv.innerHTML = `
        <button class="add-subtask-btn">
            <i class="fa-solid fa-plus"></i> Add a subtask...
        </button>
    `;
    subtasksSection.appendChild(addSubtaskDiv);
    
    // Add task notes
    const taskNotes = taskDetails.querySelector('.task-notes input');
    taskNotes.value = task.notes || '';
    
    // Update creation info
    const creationInfo = taskDetails.querySelector('.task-creation-info');
    creationInfo.innerHTML = `
        Created on ${formatDate(new Date())}
        <button class="delete-task-btn"><i class="fa-regular fa-trash-can"></i></button>
    `;
    
    // Mark the selected task in the UI
    document.querySelectorAll('.task').forEach(taskEl => {
        taskEl.classList.remove('selected');
        if (taskEl.dataset.taskId == taskId) {
            taskEl.classList.add('selected');
        }
    });
    
    // Setup subtask checkbox event listeners
    setupSubtaskCheckboxes();
}

/**
 * Close the task details sidebar
 */
function closeTaskDetails() {
    selectedTaskId = null;
    document.querySelector('.task-details').style.display = 'none';
    document.querySelectorAll('.task').forEach(taskEl => {
        taskEl.classList.remove('selected');
    });
}

/**
 * Add a subtask to a task
 * @param {string} taskId - The ID of the parent task
 * @param {string} subtaskName - The name of the subtask
 */
function addSubtask(taskId, subtaskName) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex !== -1) {
        // Create the subtask
        const subtask = {
            id: Date.now(),
            name: subtaskName,
            completed: false
        };
        
        // Add it to the task
        if (!tasks[taskIndex].subtasks) {
            tasks[taskIndex].subtasks = [];
        }
        tasks[taskIndex].subtasks.push(subtask);
        
        // Save and re-render
        saveState({ tasks });
        selectTask(taskId); // Refresh the task details view
    }
}

/**
 * Setup event listeners for subtask checkboxes
 */
function setupSubtaskCheckboxes() {
    document.querySelectorAll('.subtask .subtask-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const subtaskEl = this.closest('.subtask');
            const subtaskId = subtaskEl.dataset.subtaskId;
            const taskId = selectedTaskId;
            
            if (taskId && subtaskId) {
                toggleSubtaskCompletion(taskId, subtaskId);
            }
        });
    });
}

/**
 * Toggle completion status of a subtask
 * @param {string} taskId - The ID of the parent task
 * @param {string} subtaskId - The ID of the subtask
 */
function toggleSubtaskCompletion(taskId, subtaskId) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex !== -1 && tasks[taskIndex].subtasks) {
        const subtaskIndex = tasks[taskIndex].subtasks.findIndex(st => st.id == subtaskId);
        if (subtaskIndex !== -1) {
            // Toggle completion
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            
            // Save and re-render
            saveState({ tasks });
            selectTask(taskId); // Refresh the task details view
        }
    }
}

/**
 * Format a date to display format (e.g., "Thu, 12 Sep 2019")
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

/**
 * Filter tasks based on selected list/project
 * @param {string} filter - The filter to apply (e.g., "Today", "Work", etc.)
 */
function filterTasks(filter) {
    let filteredTasks = [];
    
    // Apply different filters based on the selected list
    switch (filter) {
        case 'Today':
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            filteredTasks = tasks.filter(task => task.dueDate === today);
            break;
        case 'Tomorrow':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            filteredTasks = tasks.filter(task => task.dueDate === tomorrowStr);
            break;
        case 'This Week':
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            filteredTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate >= weekStart && dueDate <= weekEnd;
            });
            break;
        case 'High Priority':
            filteredTasks = tasks.filter(task => task.priority >= 3);
            break;
        case 'All':
            filteredTasks = [...tasks];
            break;
        case 'Completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'Tasks':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        default:
            // For projects and tags
            filteredTasks = tasks.filter(task => 
                task.project === filter || 
                (task.tags && task.tags.includes(filter.toLowerCase()))
            );
    }
    
    renderTasks(filteredTasks);
}

/**
 * Render tasks to the UI, grouped by project
 * @param {Array} tasksToRender - The tasks to render (defaults to all tasks)
 */
function renderTasks(tasksToRender = tasks) {
    const taskGroupsContainer = document.querySelector('.task-groups');
    taskGroupsContainer.innerHTML = ''; // Clear existing tasks
    
    // Group tasks by project
    const tasksByProject = groupTasksByProject(tasksToRender);
    
    // Render each group
    Object.entries(tasksByProject).forEach(([project, projectTasks]) => {
        // Calculate total estimated time for this project
        const totalTime = projectTasks.reduce(function(sum, task) {
            return sum + (task.estimatedTime || 0);
        }, 0);
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        const timeString = hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`;
        
        // Create project group element
        const taskGroup = document.createElement('div');
        taskGroup.classList.add('task-group');
        
        taskGroup.innerHTML = `
            <div class="task-group-header">
                <h2>${project} <span class="time-info">• ${timeString}</span></h2>
            </div>
            <div class="tasks" data-project="${project}"></div>
        `;
        
        taskGroupsContainer.appendChild(taskGroup);
        
        // Get the tasks container for this project
        const tasksContainer = taskGroup.querySelector('.tasks');
        
        // Add tasks for this project
        projectTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.classList.add('task');
            if (task.completed) {
                taskEl.classList.add('completed');
            }
            taskEl.dataset.taskId = task.id;
            
            // Determine priority class
            let priorityDots = '';
            for (let i = 0; i < 4; i++) {
                priorityDots += `<span class="priority-dot${i < task.priority ? ' active' : ''}"></span>`;
            }
            
            // Format tags
            let tagsHtml = '';
            if (task.tags && task.tags.length > 0) {
                task.tags.forEach(tag => {
                    tagsHtml += `<span class="tag ${tag}">#${tag}</span>`;
                });
            }
            
            // Create task HTML
            taskEl.innerHTML = `
                <div class="task-checkbox">
                    <i class="${task.completed ? 'fa-solid fa-check-circle' : 'fa-regular fa-circle'}"></i>
                </div>
                <div class="task-content">
                    <div class="task-name">${task.name} ${tagsHtml}</div>
                    <div class="task-metadata">
                        <div class="task-priority">
                            ${priorityDots}
                        </div>
                    </div>
                </div>
                <div class="task-date">${task.dueDate ? formatDate(task.dueDate) : ''}</div>
            `;
            
            tasksContainer.appendChild(taskEl);
        });
    });
    
    // Set up drag and drop for tasks
    setupDragAndDrop();
    
    // Update task statistics
    updateTaskStatistics(tasksToRender);
    
    // Update progress tracking
    updateProgress(tasksToRender);
}

/**
 * Group tasks by their project
 * @param {Array} tasksToGroup - The tasks to group
 * @returns {Object} Tasks grouped by project
 */
function groupTasksByProject(tasksToGroup) {
    return tasksToGroup.reduce((groups, task) => {
        const project = task.project || 'Uncategorized';
        if (!groups[project]) {
            groups[project] = [];
        }
        groups[project].push(task);
        return groups;
    }, {});
}

/**
 * Update task statistics in the UI
 * @param {Array} tasksToCount - The tasks to count statistics for
 */
function updateTaskStatistics(tasksToCount) {
    // Count total and completed tasks
    const totalTasks = tasksToCount.length;
    const completedTasks = tasksToCount.filter(task => task.completed).length;
    const incompleteTasks = totalTasks - completedTasks;
    
    // Calculate total estimated time
    const estimatedTime = tasksToCount.reduce((sum, task) => {
        if (!task.completed) {
            return sum + (task.estimatedTime || 0);
        }
        return sum;
    }, 0);
    const estimatedHours = Math.floor(estimatedTime / 60);
    const estimatedMinutes = estimatedTime % 60;
    
    // Calculate elapsed time (for completed tasks)
    const elapsedTime = tasksToCount.reduce((sum, task) => {
        if (task.completed) {
            return sum + (task.estimatedTime || 0);
        }
        return sum;
    }, 0);
    
    // Update the UI
    document.querySelectorAll('.stat-box').forEach(statBox => {
        const statLabel = statBox.querySelector('.stat-label').textContent.trim();
        const statValue = statBox.querySelector('.stat-value');
        
        switch (statLabel) {
            case 'Tasks to be Completed':
                statValue.textContent = incompleteTasks;
                break;
            case 'Completed Tasks':
                statValue.textContent = completedTasks;
                break;
            case 'Estimated Time':
                statValue.innerHTML = `${estimatedHours} <span class="divider">:</span> ${estimatedMinutes}`;
                break;
            case 'Elapsed Time':
                statValue.textContent = elapsedTime;
                break;
        }
    });
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

/**
 * Set up drag and drop functionality for tasks
 */
function setupDragAndDrop() {
    const taskElements = document.querySelectorAll('.task');
    let draggedTask = null;
    
    taskElements.forEach(task => {
        // Make tasks draggable
        task.setAttribute('draggable', true);
        
        // Drag start event
        task.addEventListener('dragstart', function(e) {
            draggedTask = this;
            this.classList.add('dragging');
            
            // Required for Firefox
            e.dataTransfer.setData('text/plain', '');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        // Drag end event
        task.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedTask = null;
        });
        
        // Drag over event
        task.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        // Drag enter event
        task.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        // Drag leave event
        task.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        // Drop event
        task.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedTask && draggedTask !== this) {
                const tasksContainer = this.closest('.tasks');
                const taskList = Array.from(tasksContainer.querySelectorAll('.task'));
                
                // Get indices for reordering
                const fromIndex = taskList.indexOf(draggedTask);
                const toIndex = taskList.indexOf(this);
                
                // Reorder in DOM
                if (fromIndex < toIndex) {
                    tasksContainer.insertBefore(draggedTask, this.nextSibling);
                } else {
                    tasksContainer.insertBefore(draggedTask, this);
                }
                
                // Update task order in the data model
                reorderTasks(fromIndex, toIndex, this.closest('.tasks').dataset.project);
            }
        });
    });
    
    // Make task containers droppable as well
    document.querySelectorAll('.tasks').forEach(container => {
        // Drag over event
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            const taskElements = this.querySelectorAll('.task');
            if (taskElements.length === 0 || e.target === this) {
                e.dataTransfer.dropEffect = 'move';
            }
        });
        
        // Drop event for empty containers
        container.addEventListener('drop', function(e) {
            if (e.target === this && draggedTask) {
                e.preventDefault();
                
                // Get the project this container belongs to
                const project = this.dataset.project;
                
                // Move task to this project and to the end
                const task = tasks.find(t => t.id == draggedTask.dataset.taskId);
                if (task) {
                    task.project = project;
                    
                    // Append the dragged task to the container
                    this.appendChild(draggedTask);
                    
                    // Save changes
                    saveState({ tasks });
                }
            }
        });
    });
}

/**
 * Reorder tasks in the data model
 * @param {number} fromIndex - The source index
 * @param {number} toIndex - The target index
 * @param {string} project - The project the tasks belong to
 */
function reorderTasks(fromIndex, toIndex, project) {
    // Filter tasks for this project
    const projectTasks = tasks.filter(task => task.project === project);
    
    // Get the task to move
    const taskToMove = projectTasks[fromIndex];
    
    // Remove from old position
    projectTasks.splice(fromIndex, 1);
    
    // Insert at new position
    projectTasks.splice(toIndex, 0, taskToMove);
    
    // Update order in the complete tasks array
    let projectTaskIndex = 0;
    tasks.forEach((task, index) => {
        if (task.project === project) {
            tasks[index] = projectTasks[projectTaskIndex++];
        }
    });
    
    // Save changes
    saveState({ tasks });
}
