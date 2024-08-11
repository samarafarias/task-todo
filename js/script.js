'use strict';

const getDB = () => JSON.parse (localStorage.getItem ('todoList')) ?? [];
const setDB = (db) => localStorage.setItem ('todoList', JSON.stringify(db));

const checkDB = () => {
    const db = getDB(); 
    const container = document.getElementById('todo-container');
    let message = document.querySelector('.todo_check');

    if (db.length === 0) { 
        if (!message) {
            message = document.createElement('div');
            message.classList.add('todo_check');
            message.innerHTML = `<p>nothing here <i class="fa-regular fa-face-frown"></i></p>`;
            container.appendChild(message);
        }
    } else {
        if(message){
            container.removeChild(message);
        }
    }
};

const newTask = (task, status,index) => {
    const item = document.createElement('div');
    item.classList.add('todo_item');
    item.innerHTML = `<input type="checkbox" ${status} class="checkbox-task" data-index=${index}>
        <div>${task}</div>
        <i class="fa-solid fa-trash" data-index=${index}></i>`;
    document.getElementById('todoList').appendChild(item);
}

const deleteTask = () =>{
    const todoList = document.getElementById('todoList');
    while (todoList.firstChild) {
        todoList.removeChild(todoList.lastChild);
    }
}
const refresh = () => {
    deleteTask();
    const db = getDB();
    db.forEach ((item, index) => newTask (item.task, item.status,index));
    checkDB(); 
}

const addTask = (event) => {
    if (event.key === 'Enter') {
        const texto = event.target.value;

        if (texto.trim() !== '') { 
            const db = getDB();
            db.unshift({'task': texto, 'status': ''});
            setDB(db);
            refresh();
            event.target.value = '';
        }
    }
};

const deleteTaskDB = (index) => {
    const db = getDB();
    db.splice (index, 1);
    setDB(db);
    refresh();
}

const atualizarItem = (index) => {
    const db = getDB();
    db[index].status = db [index].status === ''? 'checked' : '';
    if (db[index].status === 'checked'){
        const [task] = db.splice(index, 1);
        db.push(task);
    }
    setDB(db);
    refresh();
}
const clickItem = (event) => {
    const element = event.target;
    if (element.classList.contains('fa-trash')) {
        const index = element.dataset.index;
        let confirmQuestion = confirm("Are you sure you want to delete this task?");
        if (confirmQuestion){
            deleteTaskDB(index);
        }else{
            refresh();
            return;
        }
    }else if (element.classList.contains('checkbox-task')){
        const index = element.dataset.index;
        atualizarItem (index);
        event.stopPropagation(); 
    }
}

const deleteAllTasks = () => { 
    let confirmQuestion = confirm("Are you sure you want to delete all tasks?");

    if (confirmQuestion){
        setDB([]);
        refresh();
    }else{
        refresh();
        return;
    }
}


document.getElementById('newItem').addEventListener('keypress',addTask);
document.getElementById('todoList').addEventListener('click',clickItem);
document.getElementById('deleteItem').addEventListener('click',deleteAllTasks);

refresh();