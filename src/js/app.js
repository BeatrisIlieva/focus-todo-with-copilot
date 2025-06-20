// Main application entry point
import { initTaskManagement, getTasks, getSelectedTaskId } from './tasks.js';
import { initPomodoroTimer, setTasks, setSelectedTaskId } from './timer.js';
import { initProgressTracking } from './progress.js';
import { loadState } from './storage.js';

/**
 * Initialize the application
 */
function initApp() {
    // Load saved state from localStorage
    const state = loadState();
    
    // Initialize all modules in proper order
    initTaskManagement();
    initPomodoroTimer();
    initProgressTracking();
    
    // Connect modules
    connectModules();
    
    // Set up event listeners for UI controls
    setupUIControls();
    
    // Request notification permission
    requestNotificationPermission();
}

/**
 * Connect the different modules together
 */
function connectModules() {
    // Share tasks data with timer module
    setTasks(getTasks());
    
    // Share selected task ID with timer module
    setSelectedTaskId(getSelectedTaskId());
}

/**
 * Request permission for browser notifications
 */
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

/**
 * Set up event listeners for UI controls
 */
function setupUIControls() {
    // Window control buttons (minimize, maximize, close)
    const minimizeBtn = document.querySelector('.control-button.minimize');
    const maximizeBtn = document.querySelector('.control-button.maximize');
    const closeBtn = document.querySelector('.control-button.close');
    
    // These buttons would typically interact with the window in a desktop app
    // For this web app, we'll just log the actions
    minimizeBtn.addEventListener('click', () => console.log('Minimize clicked'));
    maximizeBtn.addEventListener('click', () => console.log('Maximize clicked'));
    closeBtn.addEventListener('click', () => console.log('Close clicked'));
    
    // Task details minimize button
    const minimizeDetailsBtn = document.querySelector('.minimize-details');
    minimizeDetailsBtn.addEventListener('click', toggleTaskDetails);
}

/**
 * Toggle the task details sidebar visibility
 */
function toggleTaskDetails() {
    const taskDetails = document.querySelector('.task-details');
    if (taskDetails.style.display === 'none') {
        taskDetails.style.display = 'block';
    } else {
        taskDetails.style.display = 'none';
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
