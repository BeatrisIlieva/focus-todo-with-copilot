/**
 * Storage Module
 * Handles saving and loading application state from localStorage
 */

// The key used for storing app state in localStorage
const STORAGE_KEY = 'focus-todo-app-state';

// Default app state
const DEFAULT_STATE = {
    tasks: [],
    timerState: {
        currentMode: 'pomodoro',
        timeRemaining: 30, // 30 seconds for testing (normally 25 * 60)
        isRunning: false,
        currentTask: null,
        completedPomodoros: 0
    },
    progressData: {
        totalTasks: 0,
        completedTasks: 0,
        totalPomodoros: 0,
        completedPomodoros: 0,
        estimatedTime: 0,
        elapsedTime: 0
    }
};

// Current app state
let appState = { ...DEFAULT_STATE };

/**
 * Load the application state from localStorage
 * @returns {Object} The loaded application state
 */
export function loadState() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        
        if (savedState) {
            // Parse the saved state
            const parsedState = JSON.parse(savedState);
            
            // Merge with default state to handle any missing properties
            appState = { ...DEFAULT_STATE, ...parsedState };
            
            console.log('State loaded from localStorage');
        } else {
            console.log('No saved state found, using default state');
            appState = { ...DEFAULT_STATE };
        }
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        appState = { ...DEFAULT_STATE };
    }
    
    return appState;
}

/**
 * Save the application state to localStorage
 * @param {Object} stateChanges - The state changes to save
 */
export function saveState(stateChanges = {}) {
    try {
        // Update the app state with the changes
        appState = { ...appState, ...stateChanges };
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        
        console.log('State saved to localStorage');
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
}

/**
 * Get the current application state
 * @returns {Object} The current application state
 */
export function getState() {
    return { ...appState };
}

/**
 * Clear all saved state and reset to defaults
 */
export function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        appState = { ...DEFAULT_STATE };
        console.log('State cleared from localStorage');
    } catch (error) {
        console.error('Error clearing state from localStorage:', error);
    }
}
