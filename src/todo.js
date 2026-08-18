const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "todos.json");

function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}


function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ id: Date.now(), text, done: false });
  saveTodos(todos);
  console.log(`Added: "${text}"`);
}

function listTodos() {
  const todos = loadTodos();
  if (todos.length === 0) {
    console.log("No todos yet. Add one with: node src/todo.js add \"task\"");
    return;
  }
  todos.forEach((todo, i) => {
    const mark = todo.done ? "[x]" : "[ ]";
    console.log(`${i + 1}. ${mark} ${todo.text}`);
  });
}

function doneTodo(index) {
  const todos = loadTodos();
  const i = index - 1;
  if (i < 0 || i >= todos.length) {
    console.log("Invalid todo number.");
    return;
  }
  todos[i].done = true;
  saveTodos(todos);
  console.log(`Marked done: "${todos[i].text}"`);
}

function removeTodo(index) {
  const todos = loadTodos();
  const i = index - 1;
  if (i < 0 || i >= todos.length) {
    console.log("Invalid todo number.");
    return;
  }
  const [removed] = todos.splice(i, 1);
  saveTodos(todos);
  console.log(`Removed: "${removed.text}"`);
}

function printHelp() {
  console.log(`Usage:
  node src/todo.js add "task text"
  node src/todo.js list
  node src/todo.js done <number>
  node src/todo.js remove <number>`);
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    args.length ? addTodo(args.join(" ")) : printHelp();
    break;
  case "list":
    listTodos();
    break;
  case "done":
    doneTodo(Number(args[0]));
    break;
  case "remove":
    removeTodo(Number(args[0]));
    break;
  default:
    printHelp();
}
