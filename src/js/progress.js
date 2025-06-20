/**
 * progress.js
 * Module for tracking and displaying progress for tasks and Pomodoros
 */

/**
 * ProgressTracker class for managing progress
 */
class ProgressTracker {
  /**
   * Creates a new ProgressTracker instance
   * @param {Object} options - Configuration options
   * @param {Function} options.onProgressChanged - Callback for progress changes
   */
  constructor(options = {}) {
    this.dailyStats = {
      date: this._getCurrentDateString(),
      completedTasks: 0,
      completedPomodoros: 0,
      totalFocusTime: 0, // in minutes
      plannedTasks: 0,
      plannedPomodoros: 0
    };
    
    this.onProgressChanged = options.onProgressChanged || (() => {});
    
    // Historical stats by date
    this.history = {};
  }

  /**
   * Updates daily statistics
   * @param {Object} stats - New stats to update
   */
  updateDailyStats(stats) {
    // Check if we need to reset for a new day
    const currentDate = this._getCurrentDateString();
    if (currentDate !== this.dailyStats.date) {
      // Save the current day's stats to history
      this.history[this.dailyStats.date] = { ...this.dailyStats };
      
      // Reset for new day
      this.dailyStats = {
        date: currentDate,
        completedTasks: 0,
        completedPomodoros: 0,
        totalFocusTime: 0,
        plannedTasks: 0,
        plannedPomodoros: 0
      };
    }
    
    // Update with new stats
    this.dailyStats = { ...this.dailyStats, ...stats };
    
    // Notify of progress change
    this.onProgressChanged(this.getProgress());
  }

  /**
   * Records a completed task
   */
  recordTaskCompleted() {
    this.updateDailyStats({
      completedTasks: this.dailyStats.completedTasks + 1
    });
  }

  /**
   * Records a new planned task
   */
  recordTaskPlanned() {
    this.updateDailyStats({
      plannedTasks: this.dailyStats.plannedTasks + 1
    });
  }

  /**
   * Records a completed pomodoro
   * @param {number} minutes - Duration of the pomodoro in minutes
   */
  recordPomodoroCompleted(minutes) {
    this.updateDailyStats({
      completedPomodoros: this.dailyStats.completedPomodoros + 1,
      totalFocusTime: this.dailyStats.totalFocusTime + minutes
    });
  }

  /**
   * Records planned pomodoros
   * @param {number} count - Number of planned pomodoros to add
   */
  recordPomodorosPlanned(count = 1) {
    this.updateDailyStats({
      plannedPomodoros: this.dailyStats.plannedPomodoros + count
    });
  }

  /**
   * Gets the current progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgressPercentage() {
    if (this.dailyStats.plannedTasks === 0 && this.dailyStats.plannedPomodoros === 0) {
      return 0;
    }
    
    // Weight tasks and pomodoros equally (50% each)
    const taskWeight = 0.5;
    const pomodoroWeight = 0.5;
    
    // Calculate task completion percentage
    let taskPercentage = 0;
    if (this.dailyStats.plannedTasks > 0) {
      taskPercentage = (this.dailyStats.completedTasks / this.dailyStats.plannedTasks) * 100;
    }
    
    // Calculate pomodoro completion percentage
    let pomodoroPercentage = 0;
    if (this.dailyStats.plannedPomodoros > 0) {
      pomodoroPercentage = (this.dailyStats.completedPomodoros / this.dailyStats.plannedPomodoros) * 100;
    }
    
    // Calculate weighted average
    let weightedPercentage;
    if (this.dailyStats.plannedTasks === 0) {
      weightedPercentage = pomodoroPercentage;
    } else if (this.dailyStats.plannedPomodoros === 0) {
      weightedPercentage = taskPercentage;
    } else {
      weightedPercentage = (taskPercentage * taskWeight) + (pomodoroPercentage * pomodoroWeight);
    }
    
    // Cap at 100%
    return Math.min(Math.round(weightedPercentage), 100);
  }

  /**
   * Gets the current progress information
   * @returns {Object} Progress information
   */
  getProgress() {
    return {
      ...this.dailyStats,
      percentage: this.getProgressPercentage()
    };
  }

  /**
   * Gets historical progress for a specific date
   * @param {string} date - Date string in YYYY-MM-DD format
   * @returns {Object|null} Historical progress or null if not found
   */
  getHistoricalProgress(date) {
    return this.history[date] || null;
  }

  /**
   * Gets the historical progress for a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Object} Historical progress by date
   */
  getProgressRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = {};
    
    // Iterate through all dates in the range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = this._formatDate(currentDate);
      
      // Get the progress for this date (or null if no data)
      result[dateString] = this.getHistoricalProgress(dateString);
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  }

  /**
   * Gets the current date as a string
   * @returns {string} Date in YYYY-MM-DD format
   * @private
   */
  _getCurrentDateString() {
    return this._formatDate(new Date());
  }

  /**
   * Formats a date as YYYY-MM-DD
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   * @private
   */
  _formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export { ProgressTracker };
