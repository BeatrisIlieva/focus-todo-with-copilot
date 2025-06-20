// Main application entry point
import { initTaskManagement } from './tasks.js';
import { initPomodoroTimer } from './timer.js';
import { initProgressTracking } from './progress.js';
import { loadState } from './storage.js';

/**
 * Initialize the application
 */
function initApp() {
    // Load saved state from localStorage
    loadState();
    
    // Initialize all modules
    initTaskManagement();
    initPomodoroTimer();
    initProgressTracking();
    
    // Set up event listeners for UI controls
    setupUIControls();
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
