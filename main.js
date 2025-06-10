let myLibrary = [];

// Загрузить сохранённые книги
function loadBooks() {
  const data = localStorage.getItem('myLibraryBooks');
  myLibrary = data ? JSON.parse(data) : [];
}

// Сохранить в localStorage
function saveBooks() {
  localStorage.setItem('myLibraryBooks', JSON.stringify(myLibrary));
}

// Класс Book
class Book {
  constructor(formData) {
    this.id     = crypto.randomUUID();
    this.title  = formData.get('title');
    this.author = formData.get('author');
    this.pages  = formData.get('pages');
    this.read   = formData.get('checkbox') === 'on';
  }

  // переключает статус чтения и возвращает его
  toggleRead() {
    this.read = !this.read;
    return this.read;
  }
}

// Удаляем книгу из myLibrary и из интерфейса
function removeBook(id, element) {
  myLibrary = myLibrary.filter(b => b.id !== id);
  saveBooks();
  element.remove();
}

// Отрисовываем одну книгу в интерфейсе
function displayBook(book) {
  const container = document.querySelector('.container');
  const div = document.createElement('div');
  div.classList.add('divclass');
  div.dataset.id = book.id; // привязка к id

  // заголовки
  const titles  = document.createElement('p');
  titles.textContent = `"${capitalizeEveryWord(book.title)}"`;
  const authors = document.createElement('p');
  authors.textContent = capitalizeEveryWord(book.author);
  const pages   = document.createElement('p');
  pages.textContent = `${book.pages} pages`;

  // кнопки
  const btnRead   = document.createElement('button');
  const btnRemove = document.createElement('button');
  btnRead.classList.add('read', 'container-button');
  btnRemove.classList.add('remove', 'container-button');
  btnRemove.textContent = 'Remove';
  btnRead.textContent   = book.read ? 'Read' : 'Not read';

  // обработчики
  btnRead.addEventListener('click', () => {
    const newStatus = book.toggleRead();
    btnRead.textContent = newStatus ? 'Read' : 'Not read';
    saveBooks();
  });

  btnRemove.addEventListener('click', () => {
    removeBook(book.id, div);
  });

  // собираем и рендерим
  div.append(titles, authors, pages, btnRead, btnRemove);
  container.append(div);
}

// Инициалная отрисовка при загрузке страницы
function initDisplay() {
  document.querySelector('.container').innerHTML = '';
  myLibrary.forEach(displayBook);
}

// утилита для капитализации
function capitalizeEveryWord(str) {
  return str
    .split(' ')
    .map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
    .join(' ');
}

// Диалог и форма
const dialog   = document.getElementById('dialog');
const addBtn   = document.querySelector('.addbook');
const cancel   = document.getElementById('cancel');
const submit   = document.getElementById('submit');
const form     = document.getElementById('form');

addBtn.addEventListener('click', () => dialog.showModal());
cancel.addEventListener('click', () => {
  form.reset();
  dialog.close();
});

// Обработка сабмита формы
submit.addEventListener('click', (e) => {
  e.preventDefault();          // предотвратить закрытие диалога по умолчанию
  const formData = new FormData(form);
  const book = new Book(formData);
  myLibrary.push(book);
  saveBooks();
  displayBook(book);

  form.reset();
  dialog.close();
});

// Запуск
loadBooks();
initDisplay();

