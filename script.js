let myLibrary = [];

//Add Event Listener on click Add New Book button
const addNewBook = document.querySelector(".addNewBook");
addNewBook.addEventListener("click", toggleForm);

function toggleForm() {
  const form = document.querySelector(".bookForm");
  form.toggleAttribute("display", "hidden");
}

function Book(userInput) {
  this.author = author;
  this.title = title;
  this.numPages = numPages;
  this.read = readStatus;
  readToggle = function () {
    this.read = this.read == "read" ? "unread" : "read";
  };
}

//Function that takes the user input and adds to the library
function addBookToLibrary(userInput) {
  newBook = new Book(userInput);

  myLibrary.append(newBook);
}

//Function that loops through myLibrary and displays each book as a card
function displayBooks() {
  const mainContent = document.querySelector(".mainContent");

  let counter = 0;
  for (let book of myLibrary) {
    let bookDisp = document.createElement("div");
    bookDisp.setAttribute("data-index", counter);
    bookDisp.classList.add("card");

    let bookTitle = document.createElement("h1");
    bookTitle.classList.add("bookTitle");
    bookTitle.textContent = book[0];
    bookDisp.appendChild(bookTitle);

    let author = document.createElement("h2");
    author.classList.add("author");
    author.textContent = book[1];
    bookDisp.appendChild(author);

    let numPages = document.createElement("p");
    numPages.classList.add("numPages");
    numPages.textContent = book[2];
    bookDisp.appendChild(numPages);

    let btnReadStatus = document.createElement("btn");
    btnReadStatus.classList.add("readStatus");
    btnReadStatus.textContent = book[3];
    bookDisp.appendChild(btnReadStatus);

    let btnRemove = document.createElement("btn");
    btnRemove.classList.add("remove");
    bookDisp.appendChild(btnReadStatus);

    mainContent.appendChild(bookDisp);
  }
}

//Function that adds a new book
//Each book has 4 parameters: author, title, number of pages, and if it's been read
function addNewBook() {}
