class Todo {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }
}

class UI {
  addTodoToList(todo) {
    const list = document.getElementById('todo-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td >${todo.title}</td>
      <td>${todo.date}</td>
      <td><a href="#" class="delete">❌<a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#todo-form');
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteTodo(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('date').value = '';
    // document.getElementById('time').value = '';
  }
}

// Local Storage Class
class Store {
  static getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem('todos'));
    }

    return todos;
  }

  static displayTodos() {
    const todos = Store.getTodos();

    todos.forEach(function (todo) {
      const ui = new UI();

      // Add todo to UI
      ui.addTodoToList(todo);
    });
  }

  static addTodo(todo) {
    const todos = Store.getTodos();

    todos.push(todo);

    localStorage.setItem('todos', JSON.stringify(todos));
  }

  static removeTodo(date) {
    const todos = Store.getTodos();

    todos.forEach(function (todo, index) {
      if (todo.date === date) {
        todos.splice(index, 1);
      }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayTodos);

// Event Listener for add todo
document.getElementById('todo-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    date = document.getElementById('date').value;
  // time = document.getElementById('time').value;

  // Instantiate todo
  const todo = new Todo(title, date);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === '' || date === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add todo to list
    ui.addTodoToList(todo);

    // Add to LS
    Store.addTodo(todo);

    // Show success
    ui.showAlert('Todo added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById('todo-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete todo
  ui.deleteTodo(e.target);

  // Remove from LS
  Store.removeTodo(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Todo removed!', 'success');

  e.preventDefault();
});

// Dark mode toggle
const toggle = document.getElementById('toggle');
toggle.addEventListener('click', (e) => {
  const html = document.querySelector('html');
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }
});
