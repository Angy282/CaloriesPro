const tasksContainer = document.getElementById("tasks");
const input = document.getElementById("task-input");
const addBtn = document.querySelector(".add-btn");

let counter = 0;
let tasks = [];

const stored = localStorage.getItem("tasks");

if (stored) {
  tasks = JSON.parse(stored);
}

// creating each task
function createTask(task, index) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("tasks-list");

  taskDiv.innerHTML = `
    <li class="task">
      ${index + 1}. ${task}
      <div class="btns">
        <button class="done-btn">Done</button>
        <button class="delete-btn" onclick="deleteTask()">Delete</button>
      </div>
    </li>
  `;

  tasksContainer.appendChild(taskDiv);

  if (task) {
    
  }
}

const resetBtn = document.querySelector(".resetBtn");

// Reset button
const reset = document.createElement("button");
reset.style.marginTop = "25px";
reset.classList.add("resetBtn");
reset.innerText = "Reset";
document.body.appendChild(reset);

// Showing the list when reload
tasks.forEach((task, index) => {
  createTask(task, index);
});

// add button
addBtn.onclick = () => {
  const value = input.value;
  if (!value) return;

  const id = new Date().getTime().toString();

  console.log(id);

  tasks.push(value);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(value, tasks.length - 1);

  input.value = "";
  input.focus();
};

// function addToLocalStorage(id, value) {
//   const grocery = { id, value };
//   console.log(grocery);
//   let items = getLocalStorage();

//   items.push(grocery);
//   localStorage.setItem("list", JSON.stringify(items));
//   console.log(items);
// }
// Deleting a specific task
const deleteBtn = document.querySelectorAll(".delete-btn");

function deleteTask(t) {}

// LocalStorage functions
function addToLocalStorage(id, value) {
  const task = { id, value };
  console.log(task);
}
