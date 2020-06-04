const todoContainer = document.getElementById("todo-container");
// const list = document.getElementById("todo");
let inputValue = document.getElementById("input");
const add = document.getElementById("add");

let data = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : {
      todo: [],
      completed: [],
    };
renderTodoList();

add.addEventListener("click", function () {
  if (inputValue.value) {
    addItem(inputValue);
  }
});

document.getElementById("input").addEventListener("keydown", function (e) {
  const value = e.target.value;
  if ((e.code === "Enter" || e.code === "NumpadEnter") && value) {
    addItem(inputValue);
  }
});

function addItem(inputvalue) {
  addItemTodo(inputvalue.value);

  data.todo.push(inputvalue.value);

  dataObjectUpdated();
  inputvalue.value = "";
}

document.getElementById("all-btn").addEventListener("click", function () {
  document.getElementById("completed").style.display = "block";
  document.getElementById("todo").style.display = "block";
});

document.getElementById("pending-btn").addEventListener("click", function () {
  document.getElementById("completed").style.display = "none";
  document.getElementById("todo").style.display = "block";
});

document.getElementById("done-btn").addEventListener("click", function () {
  document.getElementById("completed").style.display = "block";
  document.getElementById("todo").style.display = "none";
});

function addItemTodo(text, completed) {
  const list = completed
    ? document.getElementById("completed")
    : document.getElementById("todo");

  let item = document.createElement("li");
  const input = document.createElement("input");
  input.value = text;
  input.contentEditable = false;
  input.classList.add("editable");
  input.addEventListener("click", function () {
    this.contentEditable = true;
  });

  input.addEventListener("keydown", function (e) {
    const value = e.target.value;
    if ((e.code === "Enter" || e.code === "NumpadEnter") && value) {
      this.contentEditable = false;
      editItem(completed, text, value);
    }
  });
  item.appendChild(input);

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const remove = document.createElement("button");
  remove.classList.add("remove");
  remove.innerHTML = `<i class="fas fa-trash-alt fa-lg"></i>`;

  //   Add click event for removing items
  remove.addEventListener("click", removeItem);

  const complete = document.createElement("button");
  complete.classList.add("done");
  complete.innerHTML = `<i class="fas fa-check-circle fa-lg"></i>`;
  if (completed) {
    complete.classList.add("active");
  }

  //   Add click event for compeleting the item
  complete.addEventListener("click", doneItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}

function renderTodoList() {
  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItemTodo(value);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addItemTodo(value, true);
  }
}

function dataObjectUpdated() {
  localStorage.setItem("todoList", JSON.stringify(data));
}

function editItem(completed, oldValue, newValue) {
  if (completed) {
    data.completed[data.completed.indexOf(oldValue)] = newValue;
  } else {
    data.todo[data.todo.indexOf(oldValue)] = newValue;
  }
  dataObjectUpdated();
}

function removeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;
  const value = item.innerText;

  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
  }

  dataObjectUpdated();
  parent.removeChild(item);
  console.log(data);
}

function doneItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;
  const value = item.getElementsByTagName("input")[0].value;
  if (this.classList.contains("active")) {
    this.classList.remove("active");
  } else {
    this.classList.add("active");
  }
  console.log(item);
  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  dataObjectUpdated();

  let target =
    id === "todo"
      ? document.getElementById("completed")
      : document.getElementById("todo");

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}
