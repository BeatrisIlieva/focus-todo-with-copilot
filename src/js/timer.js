/**
 * timer.js
 * Module for handling the Pomodoro timer functionality
 */

/**
 * Timer states
 * @enum {string}
 */
const TimerState = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  BREAK: 'break'
};

/**
 * Timer settings
 * @typedef {Object} TimerSettings
 * @property {number} focusDuration - Focus duration in minutes
 * @property {number} shortBreakDuration - Short break duration in minutes
 * @property {number} longBreakDuration - Long break duration in minutes
 * @property {number} longBreakInterval - Number of pomodoros before a long break
 * @property {boolean} autoStartBreaks - Whether to automatically start breaks
 * @property {boolean} autoStartPomodoros - Whether to automatically start pomodoros
 */

/**
 * Default timer settings
 * @type {TimerSettings}
 */
const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false
};

/**
 * PomodoroTimer class for managing pomodoro timing functionality
 */
class PomodoroTimer {
  /**
   * Creates a new PomodoroTimer instance
   * @param {Object} options - Configuration options
   * @param {Function} options.onTick - Callback for timer ticks (seconds)
   * @param {Function} options.onStateChange - Callback for state changes
   * @param {Function} options.onComplete - Callback for timer completion
   */
  constructor(options = {}) {
    this.settings = { ...DEFAULT_SETTINGS };
    this.state = TimerState.IDLE;
    this.timeRemaining = this.settings.focusDuration * 60;
    this.intervalId = null;
    this.completedPomodoros = 0;
    
    // Callbacks
    this.onTick = options.onTick || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onComplete = options.onComplete || (() => {});
  }

  /**
   * Updates timer settings
   * @param {TimerSettings} newSettings - New timer settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    // If in idle state, update the time remaining based on new focus duration
    if (this.state === TimerState.IDLE) {
      this.timeRemaining = this.settings.focusDuration * 60;
      this.onTick(this.timeRemaining);
    }
  }

  /**
   * Starts the timer
   */
  start() {
    if (this.state === TimerState.RUNNING) return;
    
    this.state = TimerState.RUNNING;
    this.intervalId = setInterval(() => this._tick(), 1000);
    this.onStateChange(this.state);
  }

  /**
   * Pauses the timer
   */
  pause() {
    if (this.state !== TimerState.RUNNING) return;
    
    this.state = TimerState.PAUSED;
    clearInterval(this.intervalId);
    this.onStateChange(this.state);
  }

  /**
   * Resets the timer to initial state
   */
  reset() {
    clearInterval(this.intervalId);
    this.state = TimerState.IDLE;
    this.timeRemaining = this.settings.focusDuration * 60;
    this.onStateChange(this.state);
    this.onTick(this.timeRemaining);
  }

  /**
   * Skips the current timer and moves to the next state
   */
  skip() {
    this._handleTimerComplete();
  }

  /**
   * Internal method to handle timer ticks
   * @private
   */
  _tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      this.onTick(this.timeRemaining);
    } else {
      this._handleTimerComplete();
    }
  }

  /**
   * Internal method to handle timer completion
   * @private
   */
  _handleTimerComplete() {
    clearInterval(this.intervalId);
    
    if (this.state === TimerState.RUNNING && this.isInFocusMode()) {
      // Completed a pomodoro
      this.completedPomodoros++;
      const isLongBreak = this.completedPomodoros % this.settings.longBreakInterval === 0;
      
      this.state = TimerState.BREAK;
      this.timeRemaining = isLongBreak 
        ? this.settings.longBreakDuration * 60 
        : this.settings.shortBreakDuration * 60;
      
      this.onComplete({
        type: 'focus',
        duration: this.settings.focusDuration,
        completedPomodoros: this.completedPomodoros
      });
      
      if (this.settings.autoStartBreaks) {
        this.start();
      } else {
        this.onStateChange(this.state);
        this.onTick(this.timeRemaining);
      }
    } else if (this.state === TimerState.RUNNING && !this.isInFocusMode()) {
      // Completed a break
      this.state = TimerState.IDLE;
      this.timeRemaining = this.settings.focusDuration * 60;
      
      this.onComplete({
        type: 'break',
        duration: this.isLongBreak() 
          ? this.settings.longBreakDuration 
          : this.settings.shortBreakDuration
      });
      
      if (this.settings.autoStartPomodoros) {
        this.start();
      } else {
        this.onStateChange(this.state);
        this.onTick(this.timeRemaining);
      }
    }
  }

  /**
   * Checks if the timer is in focus mode
   * @returns {boolean} True if in focus mode, false if in break mode
   */
  isInFocusMode() {
    return this.state !== TimerState.BREAK;
  }

  /**
   * Checks if the current break is a long break
   * @returns {boolean} True if it's a long break, false otherwise
   */
  isLongBreak() {
    return this.completedPomodoros % this.settings.longBreakInterval === 0;
  }

  /**
   * Gets the current timer status
   * @returns {Object} Timer status object
   */
  getStatus() {
    return {
      state: this.state,
      timeRemaining: this.timeRemaining,
      completedPomodoros: this.completedPomodoros,
      isInFocusMode: this.isInFocusMode(),
      isLongBreak: this.isLongBreak()
    };
  }
}

export { PomodoroTimer, TimerState, DEFAULT_SETTINGS };
