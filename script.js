let myLibrary = [];

//Constructor function for a book
function Book(userInput) {
  this.author = userInput[0];
  this.title = userInput[1];
  this.numPages = userInput[2];
  this.read = userInput[3];
  readToggle = function () {
    this.read = this.read == "read" ? "unread" : "read";
  };
}

//Function that takes the user input and adds to the library
function addBookToLibrary(userInput) {
  newBook = new Book(userInput);
  myLibrary.append(newBook);
}

function processUserInput() {
  this.preventDefault();
  const inputTitle = document.querySelector("input#title");
  const inputAuthor = document.querySelector("input#author");
  const inputNumPages = document.querySelector("input#numPages");

  let userInput = [inputTitle.value, inputAuthor.value, inputNumPages.value];
  addBookToLibrary(userInput);
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

//Add functionality to button
const btnAddBook = document.querySelector(".addNewBook");
btnAddBook.addEventListener("click", addForm);

const divForm = document.querySelector(".bookForm");
function addForm() {
  const bookForm = document.querySelector(".bookForm");
  bookForm.style.display = "flex";
}

//Prevent clicks on the form to propagate up to parent div
divForm.addEventListener("click", (e) => e.stopPropagation(), true);

//Remove if clicking outside of the form
divForm.addEventListener("click", removeForm, false);

function removeForm() {
  const bookForm = document.querySelector(".bookForm");
  bookForm.style.display = "none";
}
