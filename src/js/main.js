/**
 * Focus To-Do App
 * Main JavaScript file
 */

import { PomodoroTimer, TimerState, DEFAULT_SETTINGS } from './timer.js';
import { TaskManager, Priority } from './tasks.js';
import { ProgressTracker } from './progress.js';
import { StorageManager, StorageKeys } from './storage.js';

/**
 * Main application class
 */
class FocusToDoApp {
  /**
   * Initializes the application
   */
  constructor() {
    // Initialize modules
    this.initModules();
    
    // Initialize UI references
    this.initUIReferences();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial data
    this.loadInitialData();
    
    // Render initial UI
    this.renderUI();
  }

  /**
   * Initializes application modules
   */
  initModules() {
    // Initialize task manager
    this.taskManager = new TaskManager({
      onTasksChanged: tasks => {
        StorageManager.saveTasks(tasks);
        this.renderTasks();
        this.updateTaskCounts();
      },
      onProjectsChanged: projects => {
        StorageManager.saveProjects(projects);
        this.renderProjects();
      }
    });
    
    // Initialize timer with callbacks
    this.timer = new PomodoroTimer({
      onTick: seconds => this.updateTimerDisplay(seconds),
      onStateChange: state => this.handleTimerStateChange(state),
      onComplete: data => this.handleTimerComplete(data)
    });
    
    // Initialize progress tracker
    this.progressTracker = new ProgressTracker({
      onProgressChanged: progress => {
        StorageManager.saveDailyStats(progress);
        this.updateProgressDisplay(progress);
      }
    });
  }

  /**
   * Initializes UI element references
   */
  initUIReferences() {
    // Timer elements
    this.timerElements = {
      minutes: document.querySelector('.timer-minutes'),
      seconds: document.querySelector('.timer-seconds'),
      startBtn: document.getElementById('timerStart'),
      pauseBtn: document.getElementById('timerPause'),
      resetBtn: document.getElementById('timerReset'),
      settingsBtn: document.getElementById('timerSettings')
    };
    
    // Task elements
    this.taskElements = {
      taskList: document.getElementById('taskList'),
      addTaskToggle: document.getElementById('addTaskToggle'),
      addTaskInput: document.getElementById('addTaskInput'),
      projectList: document.getElementById('projectList'),
      addProjectBtn: document.getElementById('addProjectBtn')
    };
    
    // Navigation elements
    this.navElements = {
      navItems: document.querySelectorAll('.nav-item'),
      viewTitle: document.querySelector('.view-title')
    };
    
    // Modal elements
    this.modalElements = {
      overlay: document.getElementById('modalOverlay'),
      taskEditModal: document.getElementById('taskEditModal'),
      timerSettingsModal: document.getElementById('timerSettingsModal'),
      closeModal: document.getElementById('closeModal'),
      closeTimerModal: document.getElementById('closeTimerModal'),
      taskEditForm: document.getElementById('taskEditForm'),
      timerSettingsForm: document.getElementById('timerSettingsForm')
    };
    
    // Stats elements
    this.statsElements = {
      completedValue: document.querySelector('.pomodoro-stats .stat-item:nth-child(1) .stat-value'),
      plannedValue: document.querySelector('.pomodoro-stats .stat-item:nth-child(2) .stat-value'),
      focusTimeValue: document.querySelector('.pomodoro-stats .stat-item:nth-child(3) .stat-value'),
      progressBar: document.querySelector('.progress-bar')
    };
  }

  /**
   * Sets up event listeners
   */
  setupEventListeners() {
    // Timer controls
    this.timerElements.startBtn.addEventListener('click', () => this.timer.start());
    this.timerElements.pauseBtn.addEventListener('click', () => this.timer.pause());
    this.timerElements.resetBtn.addEventListener('click', () => this.timer.reset());
    this.timerElements.settingsBtn.addEventListener('click', () => this.openTimerSettings());
    
    // Task management
    this.taskElements.addTaskToggle.addEventListener('click', () => {
      this.taskElements.addTaskInput.focus();
    });
    
    this.taskElements.addTaskInput.addEventListener('keypress', event => {
      if (event.key === 'Enter' && event.target.value.trim()) {
        this.addTask(event.target.value.trim());
        event.target.value = '';
      }
    });
    
    // Add project
    this.taskElements.addProjectBtn.addEventListener('click', () => {
      this.showAddProjectDialog();
    });
    
    // Navigation
    this.navElements.navItems.forEach(item => {
      item.addEventListener('click', () => {
        this.setActiveNavItem(item);
      });
    });
    
    // Modal close buttons
    this.modalElements.closeModal.addEventListener('click', () => {
      this.hideModal(this.modalElements.taskEditModal);
    });
    
    this.modalElements.closeTimerModal.addEventListener('click', () => {
      this.hideModal(this.modalElements.timerSettingsModal);
    });
    
    // Handle form submissions
    this.modalElements.taskEditForm.addEventListener('submit', event => {
      event.preventDefault();
      this.handleTaskEditSubmit();
    });
    
    this.modalElements.timerSettingsForm.addEventListener('submit', event => {
      event.preventDefault();
      this.handleTimerSettingsSubmit();
    });
    
    // Setup drag and drop for tasks
    this.setupDragAndDrop();
  }

  /**
   * Loads initial data from storage
   */
  loadInitialData() {
    // Load tasks and projects
    const tasks = StorageManager.loadTasks();
    const projects = StorageManager.loadProjects();
    
    this.taskManager.tasks = tasks;
    this.taskManager.projects = projects;
    
    // Load timer settings
    const timerSettings = StorageManager.loadTimerSettings(DEFAULT_SETTINGS);
    this.timer.updateSettings(timerSettings);
    
    // Load daily stats
    const dailyStats = StorageManager.loadDailyStats(this.progressTracker.dailyStats);
    this.progressTracker.updateDailyStats(dailyStats);
    
    // Load history
    const history = StorageManager.loadHistory();
    this.progressTracker.history = history;
  }

  /**
   * Renders the initial UI
   */
  renderUI() {
    this.renderTasks();
    this.renderProjects();
    this.updateTaskCounts();
    this.updateTimerDisplay(this.timer.timeRemaining);
    this.updateProgressDisplay(this.progressTracker.getProgress());
  }

  /**
   * Renders tasks in the task list
   */
  renderTasks() {
    // Implementation will be completed in the next step
    console.log('Rendering tasks');
  }

  /**
   * Renders projects in the sidebar
   */
  renderProjects() {
    // Implementation will be completed in the next step
    console.log('Rendering projects');
  }

  /**
   * Updates all task counts in the navigation
   */
  updateTaskCounts() {
    // Implementation will be completed in the next step
    console.log('Updating task counts');
  }

  /**
   * Updates the timer display
   * @param {number} seconds - Remaining seconds
   */
  updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    this.timerElements.minutes.textContent = mins.toString().padStart(2, '0');
    this.timerElements.seconds.textContent = secs.toString().padStart(2, '0');
  }

  /**
   * Handles timer state changes
   * @param {string} state - New timer state
   */
  handleTimerStateChange(state) {
    // Update UI based on timer state
    switch (state) {
      case TimerState.RUNNING:
        this.timerElements.startBtn.disabled = true;
        this.timerElements.pauseBtn.disabled = false;
        break;
      case TimerState.PAUSED:
      case TimerState.IDLE:
        this.timerElements.startBtn.disabled = false;
        this.timerElements.pauseBtn.disabled = true;
        break;
      case TimerState.BREAK:
        this.timerElements.startBtn.disabled = false;
        this.timerElements.pauseBtn.disabled = true;
        break;
    }
  }

  /**
   * Handles timer completion
   * @param {Object} data - Completion data
   */
  handleTimerComplete(data) {
    if (data.type === 'focus') {
      // Record completed pomodoro
      this.progressTracker.recordPomodoroCompleted(data.duration);
      
      // Show notification
      this.showNotification('Pomodoro completed!', 'Time for a break.');
    } else {
      // Show notification
      this.showNotification('Break completed!', 'Ready for the next pomodoro?');
    }
  }

  /**
   * Updates the progress display
   * @param {Object} progress - Progress data
   */
  updateProgressDisplay(progress) {
    this.statsElements.completedValue.textContent = progress.completedTasks;
    this.statsElements.plannedValue.textContent = progress.plannedTasks;
    this.statsElements.focusTimeValue.textContent = progress.totalFocusTime;
    
    // Update progress bar
    this.statsElements.progressBar.style.width = `${progress.percentage}%`;
    this.statsElements.progressBar.setAttribute('aria-valuenow', progress.percentage);
  }

  /**
   * Adds a new task
   * @param {string} taskName - Name of the task
   */
  addTask(taskName) {
    // Implementation will be completed in the next step
    console.log('Adding task:', taskName);
  }

  /**
   * Shows the add project dialog
   */
  showAddProjectDialog() {
    // Implementation will be completed in the next step
    console.log('Showing add project dialog');
  }

  /**
   * Sets the active navigation item
   * @param {HTMLElement} item - Navigation item to activate
   */
  setActiveNavItem(item) {
    // Remove active class from all items
    this.navElements.navItems.forEach(navItem => {
      navItem.classList.remove('active');
    });
    
    // Add active class to the clicked item
    item.classList.add('active');
    
    // Update the view title
    const viewTitle = item.querySelector('.nav-button span').textContent;
    this.navElements.viewTitle.textContent = viewTitle;
    
    // Render tasks based on the selected view
    this.renderTasksForCurrentView();
  }

  /**
   * Renders tasks for the current selected view
   */
  renderTasksForCurrentView() {
    // Implementation will be completed in the next step
    console.log('Rendering tasks for current view');
  }

  /**
   * Shows a modal
   * @param {HTMLElement} modal - Modal element to show
   */
  showModal(modal) {
    this.modalElements.overlay.hidden = false;
    modal.hidden = false;
  }

  /**
   * Hides a modal
   * @param {HTMLElement} modal - Modal element to hide
   */
  hideModal(modal) {
    this.modalElements.overlay.hidden = true;
    modal.hidden = true;
  }

  /**
   * Opens timer settings modal
   */
  openTimerSettings() {
    const settings = this.timer.settings;
    
    // Set form values
    document.getElementById('focusDuration').value = settings.focusDuration;
    document.getElementById('shortBreakDuration').value = settings.shortBreakDuration;
    document.getElementById('longBreakDuration').value = settings.longBreakDuration;
    document.getElementById('longBreakInterval').value = settings.longBreakInterval;
    document.getElementById('autoStartBreaks').checked = settings.autoStartBreaks;
    document.getElementById('autoStartPomodoros').checked = settings.autoStartPomodoros;
    
    // Show the modal
    this.showModal(this.modalElements.timerSettingsModal);
  }

  /**
   * Handles timer settings form submission
   */
  handleTimerSettingsSubmit() {
    const newSettings = {
      focusDuration: parseInt(document.getElementById('focusDuration').value, 10),
      shortBreakDuration: parseInt(document.getElementById('shortBreakDuration').value, 10),
      longBreakDuration: parseInt(document.getElementById('longBreakDuration').value, 10),
      longBreakInterval: parseInt(document.getElementById('longBreakInterval').value, 10),
      autoStartBreaks: document.getElementById('autoStartBreaks').checked,
      autoStartPomodoros: document.getElementById('autoStartPomodoros').checked
    };
    
    // Update timer settings
    this.timer.updateSettings(newSettings);
    
    // Save settings
    StorageManager.saveTimerSettings(newSettings);
    
    // Hide the modal
    this.hideModal(this.modalElements.timerSettingsModal);
  }

  /**
   * Handles task edit form submission
   */
  handleTaskEditSubmit() {
    // Implementation will be completed in the next step
    console.log('Handling task edit submit');
    this.hideModal(this.modalElements.taskEditModal);
  }

  /**
   * Sets up drag and drop functionality for tasks
   */
  setupDragAndDrop() {
    // Implementation will be completed in the next step
    console.log('Setting up drag and drop');
  }

  /**
   * Shows a desktop notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   */
  showNotification(title, body) {
    if ('Notification' in window) {
      // Check notification permissions
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  }
}

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new FocusToDoApp();
  console.log('Focus To-Do app initialized');
  
  // Make app instance available for debugging
  window.focusApp = app;
});
