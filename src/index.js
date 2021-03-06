import './style.css';

const getDataFromLocalStorage = () => {
  const todoList = localStorage.getItem('todoList');
  return JSON.parse(todoList);
};

const updateView = () => {
  const todoList = getDataFromLocalStorage();
  const todo = document.getElementById('todo-list');
  todo.innerHTML = '';
  if (todoList) {
    todoList.forEach((todoListItem) => {
      todo.innerHTML += `
        <li><hr></li>
        <li class="todo ${todoListItem.editable ? 'active' : ''}" >
            <div>
              <input type="checkbox" name="checkbox" id="checkbox_${todoListItem.id}" ${todoListItem.completed ? 'checked' : ''}>
              <input id="input_${todoListItem.id}" ${todoListItem.editable ? '' : 'disabled="true"'} value="${todoListItem.description}" class="borderless ${todoListItem.completed ? 'edit' : ''} " />
            </div>
            <section class="action">
              <button type="button" ${todoListItem.editable ? 'hidden' : ''} id="toggleMode_${todoListItem.id}" class="fa fa-pencil"></button>
              <button type="button" ${todoListItem.editable ? '' : 'hidden'} id="save_${todoListItem.id}" class="fa fa-check"></button>
              <button  type="button" ${todoListItem.editable ? '' : 'hidden'} id="delete_${todoListItem.id}" class="fa fa-close"></button>
            </section>
        </li>
      `;
    });
  }
};

const storeItem = (items) => {
  if (items.length > 0) {
    localStorage.setItem('todoList', JSON.stringify(items));
  } else {
    localStorage.clear();
  }
};

const clearLocalStorage = () => {
  const todoListArr = getDataFromLocalStorage();
  if (todoListArr) {
    let counter = todoListArr.length;
    while (counter > 0) {
      if (todoListArr[counter - 1].completed) {
        todoListArr.splice(counter - 1, 1);
      }
      counter -= 1;
    }
    storeItem(todoListArr);
    updateView();
  }
};

const clearInput = () => {
  document.getElementById('todoListInput').value = '';
};

const toggleCheckbox = (id) => {
  const todoListArr = getDataFromLocalStorage();
  const checkboxElement = document.getElementById(id).checked;
  const arrIndex = todoListArr.findIndex((item) => `checkbox_${item.id}` === id);
  todoListArr[arrIndex].completed = checkboxElement;
  storeItem(todoListArr);
  updateView();
};

const toggleEdit = (id, element) => {
  const todoListArr = getDataFromLocalStorage();
  const arrIndex = todoListArr.findIndex((item) => `${element}_${item.id}` === id);
  todoListArr[arrIndex].editable = !todoListArr[arrIndex].editable;
  storeItem(todoListArr);
  updateView();
};

const saveEdit = (id, element) => {
  const newInputValue = document.getElementById(`input_${id.split('_')[1]}`);
  const todoListArr = getDataFromLocalStorage();
  const arrIndex = todoListArr.findIndex((item) => `${element}_${item.id}` === id);
  todoListArr[arrIndex].description = newInputValue.value;
  storeItem(todoListArr);
  toggleEdit(`toggleMode_${id.split('_')[1]}`, 'toggleMode');
};

const deleteItem = (id, element) => {
  const todoListArr = getDataFromLocalStorage();
  const arrIndex = todoListArr.findIndex((item) => `${element}_${item.id}` === id);
  todoListArr.splice(arrIndex, 1);

  for (let i = 0; i < todoListArr.length; i += 1) {
    todoListArr[i].index = i + 1;
  }
  storeItem(todoListArr);
  updateView();
};

const addItem = (data) => {
  const item = {
    completed: false,
    description: data,
    id: Math.random().toString(16).slice(2),
    editable: false,
    index: 1,
  };
  const previousTodoList = getDataFromLocalStorage();
  let todoList = [];
  if (previousTodoList !== null) {
    item.index = previousTodoList.length + 1;
    todoList = [...getDataFromLocalStorage(), item];
  } else {
    todoList.push(item);
  }
  storeItem(todoList);
  clearInput();
  updateView();
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addItem(formData.get('new-todo'));
  });

  document
    .getElementById('todo-list')
    .addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        toggleCheckbox(e.target.id);
      } else if (e.target.type === 'button') {
        const eventType = String(e.target.id);
        if (eventType.indexOf('save') !== -1) {
          saveEdit(e.target.id, 'save');
        }
        if (eventType.indexOf('delete') !== -1) {
          deleteItem(e.target.id, 'delete');
        }
        if (eventType.indexOf('toggleMode') !== -1) {
          toggleEdit(e.target.id, 'toggleMode');
        }
      }
    });

  document
    .getElementById('clear-completed-button')
    .addEventListener('click', () => {
      clearLocalStorage();
    });
});

document.addEventListener('load', updateView());
