/**
 * tasks.js
 * Module for managing tasks functionality
 */

/**
 * Task priority levels
 * @enum {number}
 */
const Priority = {
  HIGHEST: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4
};

/**
 * Task object structure
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} name - Task name/title
 * @property {boolean} completed - Whether the task is completed
 * @property {Priority} priority - Task priority level
 * @property {string} [projectId] - ID of the project the task belongs to (optional)
 * @property {string} [dueDate] - Due date in ISO format (optional)
 * @property {number} [estimatedPomodoros] - Estimated number of pomodoros (optional)
 * @property {number} [completedPomodoros] - Completed pomodoros count (optional)
 * @property {string} [notes] - Additional notes (optional)
 * @property {Array<Subtask>} [subtasks] - List of subtasks (optional)
 */

/**
 * Subtask object structure
 * @typedef {Object} Subtask
 * @property {string} id - Unique identifier for the subtask
 * @property {string} name - Subtask name/title
 * @property {boolean} completed - Whether the subtask is completed
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} name - Project name
 * @property {string} color - Color associated with the project (hex or name)
 */

/**
 * TaskManager class for handling task operations
 */
class TaskManager {
  /**
   * Creates a new TaskManager instance
   * @param {Object} options - Configuration options
   * @param {Function} options.onTasksChanged - Callback when tasks change
   * @param {Function} options.onProjectsChanged - Callback when projects change
   */
  constructor(options = {}) {
    this.tasks = [];
    this.projects = [];
    this.onTasksChanged = options.onTasksChanged || (() => {});
    this.onProjectsChanged = options.onProjectsChanged || (() => {});
  }

  /**
   * Creates a new task
   * @param {Object} taskData - Task data (without ID)
   * @returns {Task} The created task
   */
  createTask(taskData) {
    const newTask = {
      id: this._generateId(),
      name: taskData.name,
      completed: false,
      priority: taskData.priority || Priority.MEDIUM,
      projectId: taskData.projectId || null,
      dueDate: taskData.dueDate || null,
      estimatedPomodoros: taskData.estimatedPomodoros || 1,
      completedPomodoros: 0,
      notes: taskData.notes || '',
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    this._notifyTasksChanged();
    return newTask;
  }

  /**
   * Updates an existing task
   * @param {string} taskId - ID of the task to update
   * @param {Object} changes - Object containing the fields to update
   * @returns {Task|null} Updated task or null if not found
   */
  updateTask(taskId, changes) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...changes,
      updatedAt: new Date().toISOString()
    };
    
    this._notifyTasksChanged();
    return this.tasks[taskIndex];
  }

  /**
   * Deletes a task by ID
   * @param {string} taskId - ID of the task to delete
   * @returns {boolean} True if task was found and deleted, false otherwise
   */
  deleteTask(taskId) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    
    if (this.tasks.length !== initialLength) {
      this._notifyTasksChanged();
      return true;
    }
    return false;
  }

  /**
   * Creates a new subtask for a specific task
   * @param {string} taskId - ID of the parent task
   * @param {Object} subtaskData - Subtask data (without ID)
   * @returns {Subtask|null} The created subtask or null if parent task not found
   */
  createSubtask(taskId, subtaskData) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    const newSubtask = {
      id: this._generateId(),
      name: subtaskData.name,
      completed: false
    };
    
    if (!this.tasks[taskIndex].subtasks) {
      this.tasks[taskIndex].subtasks = [];
    }
    
    this.tasks[taskIndex].subtasks.push(newSubtask);
    this.tasks[taskIndex].updatedAt = new Date().toISOString();
    
    this._notifyTasksChanged();
    return newSubtask;
  }

  /**
   * Updates an existing subtask
   * @param {string} taskId - ID of the parent task
   * @param {string} subtaskId - ID of the subtask to update
   * @param {Object} changes - Object containing the fields to update
   * @returns {Subtask|null} Updated subtask or null if not found
   */
  updateSubtask(taskId, subtaskId, changes) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    const task = this.tasks[taskIndex];
    if (!task.subtasks) return null;
    
    const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId);
    if (subtaskIndex === -1) return null;
    
    task.subtasks[subtaskIndex] = {
      ...task.subtasks[subtaskIndex],
      ...changes
    };
    
    task.updatedAt = new Date().toISOString();
    this._notifyTasksChanged();
    return task.subtasks[subtaskIndex];
  }

  /**
   * Deletes a subtask
   * @param {string} taskId - ID of the parent task
   * @param {string} subtaskId - ID of the subtask to delete
   * @returns {boolean} True if subtask was found and deleted, false otherwise
   */
  deleteSubtask(taskId, subtaskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || !this.tasks[taskIndex].subtasks) return false;
    
    const task = this.tasks[taskIndex];
    const initialLength = task.subtasks.length;
    
    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
    
    if (task.subtasks.length !== initialLength) {
      task.updatedAt = new Date().toISOString();
      this._notifyTasksChanged();
      return true;
    }
    return false;
  }

  /**
   * Creates a new project
   * @param {Object} projectData - Project data
   * @returns {Project} The created project
   */
  createProject(projectData) {
    const newProject = {
      id: this._generateId(),
      name: projectData.name,
      color: projectData.color || this._getRandomColor()
    };
    
    this.projects.push(newProject);
    this._notifyProjectsChanged();
    return newProject;
  }

  /**
   * Updates an existing project
   * @param {string} projectId - ID of the project to update
   * @param {Object} changes - Object containing the fields to update
   * @returns {Project|null} Updated project or null if not found
   */
  updateProject(projectId, changes) {
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return null;
    
    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...changes
    };
    
    this._notifyProjectsChanged();
    return this.projects[projectIndex];
  }

  /**
   * Deletes a project by ID
   * @param {string} projectId - ID of the project to delete
   * @returns {boolean} True if project was found and deleted, false otherwise
   */
  deleteProject(projectId) {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== projectId);
    
    if (this.projects.length !== initialLength) {
      // Update tasks that belonged to this project
      this.tasks.forEach(task => {
        if (task.projectId === projectId) {
          task.projectId = null;
        }
      });
      
      this._notifyProjectsChanged();
      this._notifyTasksChanged();
      return true;
    }
    return false;
  }

  /**
   * Gets all tasks for a specific project
   * @param {string} projectId - ID of the project
   * @returns {Array<Task>} List of tasks in the project
   */
  getTasksByProject(projectId) {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  /**
   * Gets all tasks for today
   * @returns {Array<Task>} List of tasks due today
   */
  getTodayTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === today.getTime();
    });
  }

  /**
   * Gets all tasks due tomorrow
   * @returns {Array<Task>} List of tasks due tomorrow
   */
  getTomorrowTasks() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === tomorrow.getTime();
    });
  }

  /**
   * Gets all tasks due this week
   * @returns {Array<Task>} List of tasks due this week
   */
  getThisWeekTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate <= endOfWeek;
    });
  }

  /**
   * Gets all high priority tasks
   * @returns {Array<Task>} List of high priority tasks
   */
  getHighPriorityTasks() {
    return this.tasks.filter(task => 
      task.priority === Priority.HIGHEST || task.priority === Priority.HIGH);
  }

  /**
   * Gets all completed tasks
   * @returns {Array<Task>} List of completed tasks
   */
  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  /**
   * Updates task order through drag and drop
   * @param {Array<string>} taskIds - Ordered array of task IDs
   */
  reorderTasks(taskIds) {
    // Create a map for faster lookup
    const taskMap = {};
    this.tasks.forEach(task => {
      taskMap[task.id] = task;
    });
    
    // Create a new ordered array of tasks
    const orderedTasks = taskIds
      .filter(id => taskMap[id])
      .map(id => taskMap[id]);
    
    // Add any tasks that weren't in the order array at the end
    const unorderedTasks = this.tasks.filter(task => !taskIds.includes(task.id));
    
    this.tasks = [...orderedTasks, ...unorderedTasks];
    this._notifyTasksChanged();
  }

  /**
   * Generates a unique ID
   * @returns {string} A unique ID
   * @private
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Gets a random color for a project
   * @returns {string} A random color in hex format
   * @private
   */
  _getRandomColor() {
    const colors = [
      '#4a90e2', // Blue
      '#50e3c2', // Teal
      '#e86c60', // Red
      '#f5a623', // Orange
      '#bd10e0', // Purple
      '#50c240', // Green
      '#9013fe', // Violet
      '#7ed321', // Lime
      '#417505', // Dark Green
      '#9b9b9b'  // Gray
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Notifies that tasks have changed
   * @private
   */
  _notifyTasksChanged() {
    this.onTasksChanged(this.tasks);
  }

  /**
   * Notifies that projects have changed
   * @private
   */
  _notifyProjectsChanged() {
    this.onProjectsChanged(this.projects);
  }
}

export { TaskManager, Priority };
