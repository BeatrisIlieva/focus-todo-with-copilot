/**
 * Progress Tracking Module
 * Handles tracking and displaying progress for tasks and pomodoros
 */

import { saveState } from './storage.js';

// Progress data
let progressData = {
    totalTasks: 0,
    completedTasks: 0,
    totalPomodoros: 0,
    completedPomodoros: 0,
    estimatedTime: 0,
    elapsedTime: 0
};

/**
 * Initialize the progress tracking module
 */
export function initProgressTracking() {
    // Update the progress UI
    updateProgressUI();
}

/**
 * Update the progress data based on tasks
 * @param {Array} tasks - The array of tasks to calculate progress from
 */
export function updateProgress(tasks) {
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Calculate pomodoro statistics
    let totalPomodoros = 0;
    let completedPomodoros = 0;
    tasks.forEach(task => {
        if (task.pomodoroQuantity) {
            totalPomodoros += task.pomodoroQuantity.total || 0;
            completedPomodoros += task.pomodoroQuantity.completed || 0;
        }
    });
    
    // Calculate time statistics (in minutes)
    let estimatedTime = tasks.reduce((total, task) => total + (task.estimatedTime || 0), 0);
    let elapsedTime = completedPomodoros * 0.5; // Using 0.5 minutes (30 seconds) per pomodoro for testing
    
    // Update the progress data
    progressData = {
        totalTasks,
        completedTasks,
        totalPomodoros,
        completedPomodoros,
        estimatedTime,
        elapsedTime
    };
    
    // Update the UI
    updateProgressUI();
    
    // Save the state
    saveState({ progressData });
}

/**
 * Update the progress UI elements
 */
function updateProgressUI() {
    // Update task statistics
    document.querySelectorAll('.stat-box').forEach(statBox => {
        const statLabel = statBox.querySelector('.stat-label').textContent.trim();
        const statValue = statBox.querySelector('.stat-value');
        
        switch (statLabel) {
            case 'Tasks to be Completed':
                statValue.textContent = progressData.totalTasks - progressData.completedTasks;
                break;
            case 'Completed Tasks':
                statValue.textContent = progressData.completedTasks;
                break;
            case 'Estimated Time':
                // Format as hours and minutes
                const estimatedHours = Math.floor(progressData.estimatedTime / 60);
                const estimatedMinutes = progressData.estimatedTime % 60;
                statValue.innerHTML = `${estimatedHours} <span class="divider">:</span> ${estimatedMinutes}`;
                break;
            case 'Elapsed Time':
                statValue.textContent = progressData.elapsedTime;
                break;
        }
    });
    
    // Update progress bar
    const percentComplete = Math.round((progressData.completedTasks / progressData.totalTasks) * 100) || 0;
    updateProgressBar(percentComplete);
}

/**
 * Add a visual progress bar to the UI if it doesn't exist
 */
function addProgressBar() {
    if (!document.querySelector('.progress-bar-container')) {
        const statsSection = document.querySelector('.task-statistics');
        
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');
        progressBarContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0%</div>
        `;
        
        statsSection.after(progressBarContainer);
    }
}

/**
 * Update the progress bar in the UI
 * @param {number} percent - The percentage to display
 */
function updateProgressBar(percent) {
    // Make sure progress bar exists
    addProgressBar();
    
    // Update the bar
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        
        // Change color based on progress
        if (percent < 30) {
            progressFill.style.backgroundColor = '#ff5c5c';
        } else if (percent < 70) {
            progressFill.style.backgroundColor = '#ffca40';
        } else {
            progressFill.style.backgroundColor = '#5fd86e';
        }
    }
}
