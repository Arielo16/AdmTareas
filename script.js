document.addEventListener('DOMContentLoaded', () => {
    const taskNameInput = document.getElementById('taskNameInput');
    const taskStartDateInput = document.getElementById('taskStartDateInput');
    const taskEndDateInput = document.getElementById('taskEndDateInput');
    const taskResponsibleInput = document.getElementById('taskResponsibleInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const currentDate = new Date().toISOString().split('T')[0];

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            let itemClass = 'list-group-item task-item';

            if (task.completed) {
                itemClass += ' completed';
            } else if (task.endDate < currentDate) {
                itemClass += ' expired';
            }

            taskItem.className = itemClass + (task.marked ? ' marked' : '');

            taskItem.innerHTML = `
                <div>
                    <span class="task-text">${task.name}</span>
                    <small> - ${task.responsible}</small>
                    <small> (Start: ${task.startDate}, End: ${task.endDate})</small>
                </div>
                <div>
                    ${task.completed ? 
                      `<button class="btn btn-success btn-sm toggle-complete" data-index="${index}">deshacer</button>` : 
                      `<button class="btn btn-success btn-sm toggle-complete" data-index="${index}" ${task.endDate < currentDate ? 'disabled' : ''}>Completado</button>`}
                    <button class="btn btn-danger btn-sm delete-task" data-index="${index}">Eliminar</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const addTask = () => {
        const taskName = taskNameInput.value.trim();
        const taskStartDate = taskStartDateInput.value;
        const taskEndDate = taskEndDateInput.value;
        const taskResponsible = taskResponsibleInput.value.trim();

        if (taskName && taskStartDate && taskEndDate && taskResponsible) {
            tasks.push({ 
                name: taskName, 
                startDate: taskStartDate, 
                endDate: taskEndDate, 
                responsible: taskResponsible, 
                completed: false,
                marked: false
            });
            saveTasks();
            renderTasks();
            taskNameInput.value = '';
            taskStartDateInput.value = '';
            taskEndDateInput.value = '';
            taskResponsibleInput.value = '';
        }
    };

    taskList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const currentDate = new Date().toISOString().split('T')[0];

        if (e.target.classList.contains('toggle-complete')) {
            if (tasks[index].endDate >= currentDate) {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            }
        } else if (e.target.classList.contains('delete-task')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('mark-task')) {
            tasks[index].marked = !tasks[index].marked;
            saveTasks();
            renderTasks();
        }
    });

    addTaskButton.addEventListener('click', addTask);
    taskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});
