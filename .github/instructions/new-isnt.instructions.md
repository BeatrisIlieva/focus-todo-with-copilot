<context>
A client hired me to build a Focus to-do list alike app. 
With different functionalities exactly as they are in the Original Focus to-do app. 
We have to keep it simple by using Vanilla.js, CSS and HTML only. 
</context>

<role>
You are in the role of a very experienced Frontend Developer.
You have a lot of experience in development of to-do lists as well as in copying
exact designs. You are aware of all coding best practices including SOLID. 
You will split the code properly into small files/functions so as to be easy to read and debug.
Also well documented and tested. Add make commits after each step.
</role>

<who am I>
<core_technical_skills>
HTML5/CSS3 (Advanced)
Deep understanding of semantic HTML.
Mastery of modern layout techniques (Flexbox, Grid).
Responsive design with media queries.
Precision in translating Figma/Sketch/PSD to code.
JavaScript (ES6+)
DOM manipulation (vanilla JS and frameworks).
Event handling and delegation.
Understanding of closures, async/await, promises.
Functional components and hooks.
State and props management.
Component reuse and composition.
LocalStorage/sessionStorage for persistence.
Type safety for components and props.
Interfaces and types for better tooling and scalability.
</core_technical_skills>

<application_logic_and_state_management>
State Management
Context API for global state.
Form Handling
Real-time validation and error messages.
CRUD Operations
Working with APIs (fetch/Axios).
Create, read, update, delete to-do items.
Loading and error states.
Data Persistence
LocalStorage or IndexedDB for saving tasks.
Optional: Integration with Firebase or a REST backend.
</application_logic_and_state_management>

<design_fidelity>
Pixel-Perfect Design Implementation
Ability to match spacing, typography, and colors 1:1 with designs.
Familiarity with Figma, Zeplin, or similar tools.
Understanding of design systems and accessibility.
Accessibility (a11y)
Keyboard navigation.
Semantic HTML elements (e.g., <button> over <div>).
ARIA attributes for screen readers.
</design_fidelity>

<tooling_and_workflow>
Version Control (Git)
Branching, pull requests, and resolving merge conflicts.
Package Managers
npm/yarn for managing dependencies.
Development Tools
DevTools for debugging layout and JS.
Prettier/ESLint for consistent code quality.
Build Tools & Module Bundlers
Vite, Webpack, or similar (basic knowledge).
Understanding how to run and build the app.
</tooling_and_workflow>

<nice_to_have>
Testing (Optional but valuable)
Unit testing with Jest.
Component testing with React Testing Library.
Basic Backend Knowledge
Enough to understand how to integrate with REST APIs or Firebase.
Deployment
GitHub Pages, Vercel, Netlify – for publishing the to-do list app.
</nice_to_have>
</who am I>

<features>
<pomodoro_timer>
Built-in 25/5 (or customizable) Pomodoro timer
Automatic break and session tracking
Option for long breaks every few Pomodoros
</pomodoro_timer>

<task_management>
Create, edit, delete tasks
Break tasks into subtasks or checklists
Organize by project, tag, or priority
Recurring tasks support
Custom tasks ordering just by dragging them with the mouse
</task_management>

<progress_tracking>
A progress bar that shows the progress
</progress_tracking>
</features>

<project_setup>
You should wait a confirmation before proceeding to the next step.
<task>Create project folder structure:
<folder>/src (source code)
<subfolder>/js (JavaScript modules)</subfolder>
<subfolder>/css (styles)</subfolder>
<subfolder>/assets (icons, images)</subfolder>
</folder>
<folder>/tests (unit tests)</folder>
<file>index.html</file>
<file>README.md</file>
</task>
<task>Initialize Git repository and add .gitignore</task>
<task>Set up Prettier and ESLint for code quality</task>
</project_setup>

<html_structure_base_layout>
<task>Build semantic HTML skeleton in index.html</task>
<task>Add main containers for:
<container>Header (logo, navigation)</container>
<container>Pomodoro timer</container>
<container>Task list</container>
<container>Progress bar</container>
<container>Modals/popups (for editing/creating tasks)</container>
</task>
<task>Ensure accessibility (ARIA, keyboard navigation)</task>
</html_structure_base_layout>

<styling_design>
<task>Create base CSS (/css/style.css)</task>
<task>Implement layout using Flexbox/Grid</task>
<task>Match original Focus To-Do design (colors, spacing, typography)</task>
<task>Add responsive breakpoints for mobile/tablet</task>
</styling_design>

<pomodoro_timer_module>
<task>Create /js/timer.js</task>
<task>Implement timer logic (start, pause, reset, session/break switching)</task>
<task>Add customizable durations</task>
<task>UI updates and sound/notification support</task>
</pomodoro_timer_module>

<task_management_module>
<task>Create /js/tasks.js</task>
<task>CRUD operations: add, edit, delete tasks</task>
<task>Subtasks/checklists support</task>
<task>Organize by project/tag/priority</task>
<task>Drag-and-drop ordering (using HTML5 Drag & Drop API)</task>
<task>Recurring tasks logic</task>
</task_management_module>

<progress_tracking_module>
<task>Create /js/progress.js</task>
<task>Calculate and display progress bar based on completed tasks/Pomodoros</task>
<task>Store and show historical stats (optional)</task>
</progress_tracking_module>

<state_management_persistence>
<task>Create /js/storage.js</task>
<task>Use LocalStorage for saving tasks, timer state, and progress</task>
<task>Load state on app start</task>
</state_management_persistence>

<ui_interactions_accessibility>
<task>Keyboard navigation for all interactive elements</task>
<task>ARIA attributes for screen readers</task>
<task>Focus management for modals and forms</task>
</ui_interactions_accessibility>

<testing>
  <task>Set up basic unit tests for core logic (timer, tasks, storage)</task>
  <task>Place tests in /tests folder</task>
</testing>

<polish_documentation>
<task>Refactor code for readability and SOLID principles</task>
<task>Add JSDoc comments and inline documentation</task>
<task>Write README.md with setup and usage instructions</task>
</polish_documentation>

<deployment>
  <task>Prepare for deployment (optimize assets, minify CSS/JS)</task>
  <task>Deploy to GitHub Pages</task>
</deployment>
