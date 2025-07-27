/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
//to do list
const todoForm: HTMLElement = document.querySelector('.todo-form')!;
const todoList: HTMLElement | null = document.querySelector('.todo-list')!;
const totalTasks: HTMLElement | null =
  document.querySelector('.total-tasks span')!;
const completedTasks: HTMLElement = document.querySelector(
  '.completed-tasks span'
)!;
const remainingTasks: HTMLElement | null = document.querySelector(
  '.remaining-tasks span'
)!;

interface Task {
  id: any;
  name: string;
  isCompleted: boolean;
}

let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');

if (localStorage.getItem('tasks')) {
  tasks.map(task => {
    createTask(task);
  });
}

// submit form
todoForm.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const input: HTMLElement = document.getElementById(
    'input'
  ) as HTMLInputElement;
  const inputValue: string | number = (
    document.getElementById('input') as HTMLInputElement
  ).value;

  // eslint-disable-next-line eqeqeq
  if (inputValue != '') {
    const task: Task = {
      id: new Date().getTime(),
      name: inputValue,
      isCompleted: false,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    createTask(task);
  }
  input.focus();
});

// remove task

todoList.addEventListener('click', (e: Event) => {
  if (
    (e.target as HTMLElement).classList.contains('remove-task') ||
    (e.target as HTMLElement | any).parentElement.classList.contains(
      'remove-task'
    )
  ) {
    const taskId: string = (e.target as HTMLElement | any).closest('li').id;
    removeTask(taskId);
  }
});

// update task - change status or name
todoList.addEventListener('input', (e: Event) => {
  const taskId: string = (e.target as HTMLElement | any).closest('li').id;
  updateTask(taskId, e.target as HTMLElement);
});

// prevent new lines with Enter
todoList.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});

// create task
function createTask(task: {id: string; name: string; isCompleted: boolean}) {
  const taskEl = document.createElement('li');
  taskEl.setAttribute('id', task.id);
  const taskElMarkup = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="${task.name}-${task.id}" name="tasks" ${
          task.isCompleted ? 'checked' : ''
        }>
        
        <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
      </div>
      <button class="remove-task" title="Remove ${task.name} task">
      ✖️
      </button>
    `;
  taskEl.innerHTML = taskElMarkup;
  (todoList as HTMLElement).appendChild(taskEl);
  countTasks();
}

// remove task
function removeTask(taskId: string) {
  tasks = tasks.filter(task => task.id !== parseInt(taskId));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  const eleToDelete = document.getElementById(taskId)!;
  eleToDelete.remove();
  countTasks();
}

// update task
function updateTask(taskId: any, el: HTMLElement): void {
  const task: any = tasks.find(task => task.id === parseInt(taskId));

  if (el.hasAttribute('contentEditable')) {
    task.name = el.textContent;
  } else {
    const span = (el.nextElementSibling as HTMLElement | any)
      .nextElementSibling;
    task.isCompleted = !task.isCompleted;
    if (task.isCompleted) {
      span.removeAttribute('contenteditable');
      el.setAttribute('checked', '');
    } else {
      el.removeAttribute('checked');
      span.setAttribute('contenteditable', '');
    }
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  countTasks();
}

function countTasks(): void {
  (totalTasks as HTMLElement | any).textContent = tasks.length;
  const completedTasksArray = tasks.filter(task => task.isCompleted === true);
  (completedTasks as HTMLElement | any).textContent =
    completedTasksArray.length;
  (remainingTasks as HTMLElement | any).textContent =
    tasks.length - completedTasksArray.length;
}

//background
async function setbackgroundImage(): Promise<void> {
  try {
    const res = await fetch(
      'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
    );
    const data = await res.json();
    const imgURL: string = data.urls.full;
    const imgAuthor: string = data.user.name;
    const myBG = document.getElementById('img-author')!; //The ! means "trust me, this is not a null reference"
    document.body.style.backgroundImage = `url(${imgURL})`;
    myBG.innerHTML = `<p>Photographer: ${imgAuthor}</p>`;
  } catch (error) {
    console.log('Fetch background IMG error -', error);
  }
}

setbackgroundImage();

function getDateTime(): void {
  const today: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date: string = today.toLocaleDateString('de-DE', options);
  const time: string = today.toLocaleTimeString('de-DE');
  const myTime = document.getElementById('time')!;
  myTime.innerHTML = `<h1>${time}</h1>
                        <p>${date}</p>`;
}

setInterval(getDateTime, 1000);

//weather
navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
  async function getWeather(): Promise<void> {
    const APIUrl = `/.netlify/functions/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
    try {
      const res: Response = await fetch(APIUrl);
      const data: any = await res.json();
      const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      console.log(data);
      const myWeather = document.getElementById('weather')!;
      const myLocation = document.getElementById('location')!;
      myWeather.innerHTML = `<img src=${iconURL}><h2>${Math.round(
        data.main.temp
      )}°C `;
      myLocation.textContent = `${data.name}`;
    } catch (error) {
      console.log('error', error);
    }
  }
  getWeather();
});

//quote
async function getQuotes(): Promise<void> {
  try {
    const res: Response = await fetch(
      'https://raw.githubusercontent.com/Qinisfighting/Assets-for-all/main/quotes.json'
    );
    const data: any = await res.json();
    const randomIndex: number = Math.floor(Math.random() * data.length);
    const quote: {
      q: string;
      a: string;
    } = data[randomIndex];
    const myQuote = document.getElementById('quote')!;
    myQuote.innerHTML = `<h3>" ${quote.q} "</h3><p> - ${quote.a}</p>`;
  } catch (error) {
    console.log('Fetch coin error -', error);
  }
}

getQuotes();
