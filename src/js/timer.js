/**
 * Pomodoro Timer Module
 * Handles the Pomodoro timer functionality
 */

import { saveState } from './storage.js';

// Default timer settings
const DEFAULT_SETTINGS = {
    pomodoro: 25 * 60, // 25 minutes in seconds
    shortBreak: 5 * 60, // 5 minutes in seconds
    longBreak: 15 * 60, // 15 minutes in seconds
    longBreakInterval: 4, // After 4 pomodoros, take a long break
};

// Timer state
let timerState = {
    currentMode: 'pomodoro', // 'pomodoro', 'shortBreak', or 'longBreak'
    timeRemaining: DEFAULT_SETTINGS.pomodoro, // Time remaining in seconds
    isRunning: false,
    currentTask: null, // The task currently being worked on
    completedPomodoros: 0, // Number of completed pomodoros
};

let timerInterval = null;

// External dependencies
let selectedTaskId = null;
let tasks = [];

/**
 * Set the tasks data for the timer to use
 * @param {Array} tasksData - The tasks data
 */
export function setTasks(tasksData) {
    tasks = tasksData;
}

/**
 * Set the selected task ID
 * @param {string} taskId - The selected task ID
 */
export function setSelectedTaskId(taskId) {
    selectedTaskId = taskId;
}

/**
 * Initialize the Pomodoro timer module
 */
export function initPomodoroTimer() {
    // Set up event listeners for timer controls
    setupTimerEventListeners();
    
    // Update the timer display initially
    updateTimerDisplay();
    
    // Make the timer modal visible
    document.querySelector('.pomodoro-modal').style.display = 'block';
}

/**
 * Set up event listeners for timer-related UI elements
 */
function setupTimerEventListeners() {
    // Timer play/pause button
    const timerButton = document.querySelector('.timer-control-btn');
    if (timerButton) {
        timerButton.addEventListener('click', toggleTimer);
    }
    
    // Start a Pomodoro from task details
    document.addEventListener('click', function(e) {
        const pomodoroStarter = e.target.closest('.pomodoro-quantity');
        if (pomodoroStarter && selectedTaskId) {
            startPomodoro(selectedTaskId);
        }
    });
    
    // Close timer button (Add it first)
    const timerModal = document.querySelector('.pomodoro-modal');
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-timer-btn');
    closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    timerModal.querySelector('.pomodoro-timer').appendChild(closeButton);
    
    // Add event listener for close button
    closeButton.addEventListener('click', function() {
        timerModal.style.display = 'none';
    });
}

/**
 * Toggle the timer between running and paused states
 */
function toggleTimer() {
    if (timerState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

/**
 * Start the timer
 */
function startTimer() {
    timerState.isRunning = true;
    
    // Update the UI to show the timer is running
    const timerButton = document.querySelector('.timer-control-btn');
    timerButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    
    // Start the interval timer
    timerInterval = setInterval(tickTimer, 1000);
    
    saveState({ timerState });
}

/**
 * Pause the timer
 */
function pauseTimer() {
    timerState.isRunning = false;
    
    // Update the UI to show the timer is paused
    const timerButton = document.querySelector('.timer-control-btn');
    timerButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    // Clear the interval timer
    clearInterval(timerInterval);
    
    saveState({ timerState });
}

/**
 * Reset the timer to its initial state
 */
function resetTimer() {
    // Stop the timer if it's running
    if (timerState.isRunning) {
        pauseTimer();
    }
    
    // Reset the timer state according to the current mode
    timerState.timeRemaining = DEFAULT_SETTINGS[timerState.currentMode];
    
    // Update the display
    updateTimerDisplay();
    
    saveState({ timerState });
}

/**
 * Process a single timer tick (1 second)
 */
function tickTimer() {
    if (timerState.timeRemaining > 0) {
        // Decrement the time remaining
        timerState.timeRemaining--;
        
        // Update the display
        updateTimerDisplay();
    } else {
        // Timer has finished
        completeTimer();
    }
}

/**
 * Handle timer completion
 */
function completeTimer() {
    // Play a notification sound
    playTimerCompleteSound();
    
    // Stop the timer
    pauseTimer();
    
    if (timerState.currentMode === 'pomodoro') {
        // Increment completed pomodoros
        timerState.completedPomodoros++;
        
        // Update the task's pomodoro count if there is a current task
        if (timerState.currentTask && tasks) {
            const task = tasks.find(t => t.id == timerState.currentTask);
            if (task && task.pomodoroQuantity) {
                task.pomodoroQuantity.completed = (task.pomodoroQuantity.completed || 0) + 1;
                
                // If task exists in DOM, update it
                const taskElement = document.querySelector(`[data-task-id="${timerState.currentTask}"]`);
                if (taskElement) {
                    const taskDetailsQuantity = document.querySelector('.pomodoro-quantity .quantity-info');
                    if (taskDetailsQuantity) {
                        taskDetailsQuantity.textContent = `${task.pomodoroQuantity.completed} / ${task.pomodoroQuantity.total}`;
                    }
                }
                
                // Save the updated tasks
                saveState({ tasks });
            }
        }
        
        // Show a completion notification
        showNotification('Pomodoro completed!', 'Time for a break');
        
        // Determine which break to take
        if (timerState.completedPomodoros % DEFAULT_SETTINGS.longBreakInterval === 0) {
            switchTimerMode('longBreak');
        } else {
            switchTimerMode('shortBreak');
        }
    } else {
        // If we were on a break, switch back to pomodoro
        switchTimerMode('pomodoro');
        showNotification('Break completed!', 'Ready to focus again?');
    }
    
    saveState({ timerState });
}

/**
 * Show a browser notification
 * @param {string} title - The notification title
 * @param {string} body - The notification body
 */
function showNotification(title, body) {
    // Check if browser supports notifications
    if ('Notification' in window) {
        // Check if permission is granted
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        }
        // Otherwise, request permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    }
}

/**
 * Switch the timer mode
 * @param {string} mode - The timer mode to switch to ('pomodoro', 'shortBreak', or 'longBreak')
 */
function switchTimerMode(mode) {
    timerState.currentMode = mode;
    timerState.timeRemaining = DEFAULT_SETTINGS[mode];
    
    updateTimerDisplay();
}

/**
 * Update the timer display in the UI
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timerState.timeRemaining / 60);
    const seconds = timerState.timeRemaining % 60;
    
    // Format the time as MM:SS
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the UI
    document.querySelector('.timer-display').textContent = timeString;
}

/**
 * Play a sound when the timer completes
 */
function playTimerCompleteSound() {
    // This would play a sound in a real implementation
    console.log('Timer complete sound played');
}

/**
 * Set the current task for the timer
 * @param {string} taskId - The ID of the task to set for the timer
 */
export function setTimerTask(taskId) {
    timerState.currentTask = taskId;
    saveState({ timerState });
}

/**
 * Start a Pomodoro timer for a specific task
 * @param {string} taskId - The ID of the task to start the timer for
 */
function startPomodoro(taskId) {
    // Find the task
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    
    // Set the current task
    timerState.currentTask = taskId;
    selectedTaskId = taskId;
    
    // Set the timer mode to pomodoro
    timerState.currentMode = 'pomodoro';
    timerState.timeRemaining = DEFAULT_SETTINGS.pomodoro;
    
    // Update the timer display
    document.querySelector('.timer-display').textContent = '25:00';
    document.querySelector('.pomodoro-timer h3').textContent = task.name;
    
    // Show the timer modal
    document.querySelector('.pomodoro-modal').style.display = 'block';
    
    // Reset the timer button to play
    const timerButton = document.querySelector('.timer-control-btn');
    timerButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    
    // Start the timer
    startTimer();
    
    saveState({ timerState });
}
