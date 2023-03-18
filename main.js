const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
   
    if (isStorageExist()) {
        loadDataFromStorage();
      }
    });

  
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }


  function addBook() {
    const BookTitle = document.getElementById('inputBookTitle').value;
    const BookAuthor = document.getElementById('inputBookAuthor').value;
    const BookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
   
    const generatedID = generateId();
    const BookObject = generateBookObject(generatedID, BookTitle, BookAuthor, BookYear, isComplete);
    books.push(BookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });

function makeBook(BookObject) {
  const bookTitle = document.createElement('h2');
  bookTitle.innerText = BookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis : ' + BookObject.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun : ' + BookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  buttonContainer.append(textTitle, textAuthor, textYear);

  const Container = document.createElement('div');
  Container.classList.add('book_item');
  Container.append(buttonContainer);
  Container.setAttribute('id', `book-${BookObject.id}`);
 
  if (BookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(BookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add("trash-button");
 
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(BookObject.id);
    });
 
    Container.append(undoButton, trashButton);
  } else {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function() {
        addBookToCompleted(BookObject.id);
    });
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function() {
        removeBookFromCompleted(BookObject.id);    
    });
    Container.append(undoButton,trashButton);
}
    
  return Container;
}
  
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('books');
  incompleteBookshelfList.innerHTML = '';
 
const completeBookshelfList = document.getElementById('completed-books');
  completeBookshelfList.innerHTML = '';  
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
        incompleteBookshelfList.append(bookElement);
    else
        completeBookshelfList.append(bookElement);
 
  }
});
 
function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
  bookTarget.isCompleted = true; 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
 
 
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return; 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}
 
function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
   
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      check = true;
      
      document.querySelector('span').innerText = 'Selesai dibaca';
    }else {
      check = false;
  
      document.querySelector('span').innerText = 'Belum selesai dibaca';
    }
  });
  
  document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.item > .inner h2');
  
    for (const book of bookList) {
      if (searchBook !== book.innerText.toLowerCase()) {
        book.parentElement.style.display = 'block';
      } else {
        book.parentElement.style.display = 'none';
      }
    }
  });