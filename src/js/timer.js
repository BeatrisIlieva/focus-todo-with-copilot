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

/**
 * Initialize the Pomodoro timer module
 */
export function initPomodoroTimer() {
    // Set up event listeners for timer controls
    setupTimerEventListeners();
    
    // Update the timer display initially
    updateTimerDisplay();
}

/**
 * Set up event listeners for timer-related UI elements
 */
function setupTimerEventListeners() {
    // Timer play/pause button
    const timerButton = document.querySelector('.timer-control-btn');
    timerButton.addEventListener('click', toggleTimer);
    
    // Other timer controls would be set up here
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
        if (timerState.currentTask) {
            // This would typically update the task's pomodoro count
            // For now, just log it
            console.log(`Task ${timerState.currentTask} completed a pomodoro`);
        }
        
        // Determine which break to take
        if (timerState.completedPomodoros % DEFAULT_SETTINGS.longBreakInterval === 0) {
            switchTimerMode('longBreak');
        } else {
            switchTimerMode('shortBreak');
        }
    } else {
        // If we were on a break, switch back to pomodoro
        switchTimerMode('pomodoro');
    }
    
    saveState({ timerState });
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
