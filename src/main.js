// Selectors
// const toDoInput = document.querySelector('.todo-input');
// const toDoBtn = document.querySelector('.todo-btn');
// const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// // Event Listeners
// toDoBtn.addEventListener('click', addToDo);
// toDoList.addEventListener('click', deletecheck);
// document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Apply saved or default theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }

    // Optionally keep saving to local storage
    savelocal(toDoInput.value);

    // Clear input
    toDoInput.value = '';
}

function deletecheck(event) {
    const item = event.target;

    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }

    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
}


function getTodos() {
    // Optionally fetch but do not render
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

    // You can log them for debugging, or leave this blank
    // console.log('Saved todos:', todos);
}

function removeLocalTodos(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

    const todoIndex = todos.indexOf(todo.children[0].innerText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;

    document.body.className = color;
    const title = document.getElementById('title');
    if (title) {
        color === 'darker'
            ? title.classList.add('darker-title')
            : title.classList.remove('darker-title');
    }

    document.querySelector('input').className = `${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = todo.classList.contains('completed')
            ? `todo ${color}-todo completed`
            : `todo ${color}-todo`;
    });

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });
}

document.querySelector("#form form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const prompt = document.querySelector(".todo-input").value.trim();
    if (!prompt) return;
  
    const watermarkHeight = 70; // in pixels
    const imageIDs = ["img1", "img2", "img3"];
  
    imageIDs.forEach(id => {
      const img = document.getElementById(id);
      img.src = "";
      img.alt = "Generating...";
    });
  
    for (let i = 0; i < 3; i++) {
      try {
        const uniquePrompt = encodeURIComponent(`${prompt} ${Date.now()}-${i}`);
        const response = await fetch(`https://image.pollinations.ai/prompt/${uniquePrompt}`);
        const blob = await response.blob();
  
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        await img.decode();
  
        // Crop watermark
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height - watermarkHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, canvas.height);
  
        const cropped = canvas.toDataURL();
        document.getElementById(imageIDs[i]).src = cropped;
        document.getElementById(imageIDs[i]).alt = `Generated Image ${i + 1}`;
      } catch (error) {
        console.error(`Image ${i + 1} error:`, error);
        document.getElementById(imageIDs[i]).alt = "Failed to load";
      }
    }
  });
  