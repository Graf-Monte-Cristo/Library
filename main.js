let myLibrary = []; // сюда будут попадать объекты книг

// Функция загрузить книги из localStorage
function loadBooks() {
  const data = localStorage.getItem('myLibraryBooks');
  if (data) {
    myLibrary = JSON.parse(data);
  } else {
    myLibrary = [];
  }
}

// Функция сохранить книги в localStorage
function saveBooks() {
  localStorage.setItem('myLibraryBooks', JSON.stringify(myLibrary));
}

function addBookToLibrary(title, author, pages, read = false) {
  // take params, create a book then store it in the array
  const newBook = {
    id: crypto.randomUUID(),
    title,
    author,
    pages,
    read,
  };
  myLibrary.push(newBook);
  return newBook;
}

// Функция удаления книги по id
function RemoveBook(id){
    myLibrary = myLibrary.filter(book => book.id !== id);
    saveBooks();
}

// Функция переключить статус «прочитано/не прочитано» по id
function  readStatus(id){
    const data = myLibrary.find(book => book.id === id);
    if(data){
        data.read = !data.read;
        saveBooks();
    }
}

loadBooks(); // Инициализация при первой загрузке

// Появляется окошко с добавлением книги

// 1) При загрузке страницы:
const form = document.getElementById("form");
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get('title');
  const author = formData.get('author');
  const pages = formData.get('pages');
  const checkbox = formData.get('checkbox') === 'on'; // checkbox возвращает "on" при checked

  displaybook(title, author, pages, checkbox);

  form.reset();
  document.querySelector(".whole").classList.add("hidden");
  document.getElementById("popup").classList.add("hidden");

  // Здесь можно вызвать функцию отрисовки списка книг, если она у вас есть
});

// 2) Обработчики для открытия/закрытия модалки:
const addBtn = document.querySelector(".add"); // кнопка «Add Book»
const overlay = document.querySelector(".whole");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancel");

addBtn.addEventListener("click", () => {
  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");
});

// Обработчик для кнопки Cancel (прячем модалку и сбрасываем форму):
cancelBtn.addEventListener("click", () => {
  form.reset();
  overlay.classList.add("hidden");
  popup.classList.add("hidden");
});
function capitalizeEveryWord(str) {
  return str
    .split(' ')                     // разбиваем по пробелам на массив слов
    .map(word => {
      if (word.length === 0) return '';     // на случай «лишних» пробелов
      return word[0].toUpperCase() +        // первая буква → заглавная
             word.slice(1).toLowerCase();   // оставшаяся часть → в нижний регистр (по желанию)
    })
    .join(' ');      // снова объединяем через пробел
}


function displaybook(title, author, pages, checkbox){
    title = capitalizeEveryWord(title);
    author = capitalizeEveryWord(author);
    const container = document.querySelector(".container");
    const div = document.createElement("div");
    div.classList.add("divclass");
    const titles = document.createElement("p");
    titles.textContent = '"' + title + '"';
    const authors = document.createElement("p");
    authors.textContent = author; 
    const page = document.createElement("p");
    page.textContent = pages + " pages"; 
    const check = document.createElement("button");
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    checkbox ?
    check.textContent = "Read":
    check.textContent = "Not read";
    check.classList.add("read", "container-button");
    remove.classList.add("remove", "container-button");


    check.addEventListener("click", () => {
        if(check.textContent === "Read"){
            check.textContent = "Not read";
        } else {
            check.textContent = "Read";
        }
    })


    div.appendChild(titles);
    div.appendChild(authors);
    div.appendChild(page);
    div.appendChild(check);
    div.appendChild(remove);
    container.appendChild(div);
    remove.addEventListener("click", () => {
        div.remove();
    })
    addBookToLibrary(title, author, pages, checkbox);
    saveBooks();

}


