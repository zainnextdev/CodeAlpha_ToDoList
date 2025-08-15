document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-task-form');
    const input = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    /**
     * Saves the current tasks array to localStorage.
     */
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };


    /**
     * Renders all tasks to the DOM.
     */
    const renderTasks = () => {
        taskList.innerHTML = ''; 

        if (tasks.length === 0) {
            taskList.innerHTML = `<p class="empty-state">All clear! Add a task to get started.</p>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            li.innerHTML = `
                <p>${task.text}</p>
                <div class="actions">
                    <button class="complete-btn" aria-label="Toggle complete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    </button>
                    <button class="delete-btn" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    /**
     * Adds a new task.
     * @param {string} text - The content of the task.
     */
    const addTask = (text) => {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };

    /**
     * Toggles the completion status of a task.
     * @param {number} id - The ID of the task to toggle.
     */
    const toggleComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };
    
    /**
     * Deletes a task.
     * @param {number} id - The ID of the task to delete.
     * @param {HTMLElement} element - The list item element to animate.
     */
    const deleteTask = (id, element) => {
        // Add animation class
        element.classList.add('removing');

        element.addEventListener('animationend', () => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = input.value.trim();

        if (taskText) {
            addTask(taskText);
            input.value = '';
            input.focus();
        }
    });

    taskList.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;

        const itemId = parseInt(item.getAttribute('data-id'));

        if (e.target.closest('.complete-btn')) {
            toggleComplete(itemId);
        }

        if (e.target.closest('.delete-btn')) {
            deleteTask(itemId, item);
        }
    });
    renderTasks();
});