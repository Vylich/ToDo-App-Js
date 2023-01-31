const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);
  saveToLocalStorage();
  renderTask(newTask);
  taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return;
	const parenNode = event.target.closest('.tasks__item');
	const id = Number(parenNode.id);
	tasks = tasks.filter((task) => task.id !== id);
	saveToLocalStorage();
	parenNode.remove();
	checkEmptyList();
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return;
	const parentNode = event.target.closest('.tasks__item');
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;
	saveToLocalStorage();
	const taskTitle = parentNode.querySelector('.task__title');
	taskTitle.classList.toggle('task__title--done');
}

function renderTask(task) {
	const cssClass = task.done ? 'task__title task__title--done' : 'task__title';
	const taskHTML = `<li id="${task.id}" class="tasks__item task">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task__buttons">
                        <button type="button" data-action="done" class="task__button">
                          <img src="./img/checked.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="task__button">
                          <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                        </button>
                      </div>
                    </li>`;
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="tasks__item empty-list">
    <img src="./img/todo-img.svg" alt="Empty" class="empty-list__img" width="48">
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

