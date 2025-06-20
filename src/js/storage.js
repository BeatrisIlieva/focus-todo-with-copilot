/**
 * storage.js
 * Module for handling data persistence using localStorage
 */

/**
 * Storage keys
 * @enum {string}
 */
const StorageKeys = {
  TASKS: 'focusTodo.tasks',
  PROJECTS: 'focusTodo.projects',
  TIMER_SETTINGS: 'focusTodo.timerSettings',
  DAILY_STATS: 'focusTodo.dailyStats',
  HISTORY: 'focusTodo.history',
  APP_SETTINGS: 'focusTodo.appSettings'
};

/**
 * StorageManager class for handling data persistence
 */
class StorageManager {
  /**
   * Saves data to localStorage
   * @param {string} key - Storage key
   * @param {*} data - Data to store (will be JSON stringified)
   * @returns {boolean} True if saved successfully
   */
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage', error);
      return false;
    }
  }

  /**
   * Loads data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Parsed data or default value
   */
  static load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage', error);
      return defaultValue;
    }
  }

  /**
   * Removes data from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if removed successfully
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage', error);
      return false;
    }
  }

  /**
   * Saves tasks to localStorage
   * @param {Array} tasks - Array of tasks
   * @returns {boolean} True if saved successfully
   */
  static saveTasks(tasks) {
    return this.save(StorageKeys.TASKS, tasks);
  }

  /**
   * Loads tasks from localStorage
   * @returns {Array} Array of tasks
   */
  static loadTasks() {
    return this.load(StorageKeys.TASKS, []);
  }

  /**
   * Saves projects to localStorage
   * @param {Array} projects - Array of projects
   * @returns {boolean} True if saved successfully
   */
  static saveProjects(projects) {
    return this.save(StorageKeys.PROJECTS, projects);
  }

  /**
   * Loads projects from localStorage
   * @returns {Array} Array of projects
   */
  static loadProjects() {
    return this.load(StorageKeys.PROJECTS, []);
  }

  /**
   * Saves timer settings to localStorage
   * @param {Object} settings - Timer settings object
   * @returns {boolean} True if saved successfully
   */
  static saveTimerSettings(settings) {
    return this.save(StorageKeys.TIMER_SETTINGS, settings);
  }

  /**
   * Loads timer settings from localStorage
   * @param {Object} defaultSettings - Default timer settings
   * @returns {Object} Timer settings
   */
  static loadTimerSettings(defaultSettings) {
    return this.load(StorageKeys.TIMER_SETTINGS, defaultSettings);
  }

  /**
   * Saves daily statistics to localStorage
   * @param {Object} stats - Daily statistics object
   * @returns {boolean} True if saved successfully
   */
  static saveDailyStats(stats) {
    return this.save(StorageKeys.DAILY_STATS, stats);
  }

  /**
   * Loads daily statistics from localStorage
   * @param {Object} defaultStats - Default daily statistics
   * @returns {Object} Daily statistics
   */
  static loadDailyStats(defaultStats) {
    return this.load(StorageKeys.DAILY_STATS, defaultStats);
  }

  /**
   * Saves historical statistics to localStorage
   * @param {Object} history - Historical statistics object
   * @returns {boolean} True if saved successfully
   */
  static saveHistory(history) {
    return this.save(StorageKeys.HISTORY, history);
  }

  /**
   * Loads historical statistics from localStorage
   * @returns {Object} Historical statistics
   */
  static loadHistory() {
    return this.load(StorageKeys.HISTORY, {});
  }

  /**
   * Saves app settings to localStorage
   * @param {Object} settings - App settings object
   * @returns {boolean} True if saved successfully
   */
  static saveAppSettings(settings) {
    return this.save(StorageKeys.APP_SETTINGS, settings);
  }

  /**
   * Loads app settings from localStorage
   * @param {Object} defaultSettings - Default app settings
   * @returns {Object} App settings
   */
  static loadAppSettings(defaultSettings) {
    return this.load(StorageKeys.APP_SETTINGS, defaultSettings);
  }

  /**
   * Exports all data as a JSON file for backup
   * @returns {Object} All stored data
   */
  static exportData() {
    return {
      tasks: this.loadTasks(),
      projects: this.loadProjects(),
      timerSettings: this.load(StorageKeys.TIMER_SETTINGS),
      dailyStats: this.load(StorageKeys.DAILY_STATS),
      history: this.loadHistory(),
      appSettings: this.load(StorageKeys.APP_SETTINGS)
    };
  }

  /**
   * Imports data from a backup JSON
   * @param {Object} data - Data to import
   * @returns {boolean} True if imported successfully
   */
  static importData(data) {
    try {
      // Validate data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Import each data type
      if (Array.isArray(data.tasks)) {
        this.saveTasks(data.tasks);
      }
      
      if (Array.isArray(data.projects)) {
        this.saveProjects(data.projects);
      }
      
      if (data.timerSettings && typeof data.timerSettings === 'object') {
        this.saveTimerSettings(data.timerSettings);
      }
      
      if (data.dailyStats && typeof data.dailyStats === 'object') {
        this.saveDailyStats(data.dailyStats);
      }
      
      if (data.history && typeof data.history === 'object') {
        this.saveHistory(data.history);
      }
      
      if (data.appSettings && typeof data.appSettings === 'object') {
        this.saveAppSettings(data.appSettings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data', error);
      return false;
    }
  }

  /**
   * Clears all stored data
   * @returns {boolean} True if cleared successfully
   */
  static clearAllData() {
    try {
      Object.values(StorageKeys).forEach(key => {
        this.remove(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing data', error);
      return false;
    }
  }
}

export { StorageManager, StorageKeys };
