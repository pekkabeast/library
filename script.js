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
  let newBook = new Book(userInput);
  myLibrary.push(newBook);
}

const bookSubmit = document.getElementById("addBookForm");
bookSubmit.addEventListener("submit", processUserInput);

function processUserInput(event) {
  let userInput = [];
  userInput[0] = document.getElementById("title").value;
  userInput[1] = document.getElementById("author").value;
  userInput[2] = document.getElementById("numPages").value;
  const formData = new FormData(bookSubmit);
  userInput[3] = formData.get("readStatus");
  addBookToLibrary(userInput);
  bookSubmit.reset();
  removeForm();
  displayBooks();
  event.preventDefault();
}

//Function that loops through myLibrary and displays each book as a card
function displayBooks() {
  const mainContent = document.querySelector(".mainContent");
  mainContent.innerHTML = "";
  let counter = 0;
  for (let book of myLibrary) {
    let bookDisp = document.createElement("div");
    bookDisp.setAttribute("data-index", counter);
    bookDisp.classList.add("card");

    let bookTitle = document.createElement("h1");
    bookTitle.classList.add("bookTitle");
    bookTitle.textContent = book.title;
    bookDisp.appendChild(bookTitle);

    let author = document.createElement("h2");
    author.classList.add("author");
    author.textContent = book.author;
    bookDisp.appendChild(author);

    let numPages = document.createElement("p");
    numPages.classList.add("numPages");
    numPages.textContent = book.numPages;
    bookDisp.appendChild(numPages);

    let btnReadStatus = document.createElement("button");
    btnReadStatus.classList.add("readStatus");
    btnReadStatus.textContent = book.read;
    bookDisp.appendChild(btnReadStatus);

    let btnRemove = document.createElement("button");
    btnRemove.classList.add("remove");
    btnRemove.textContent = "Remove";
    bookDisp.appendChild(btnRemove);
    mainContent.appendChild(bookDisp);
  }

  let removeBtns = document.querySelectorAll(".readStatus");
  console.log(removeBtns);
  removeBtns.forEach((button) =>
    button.addEventListener("click", () => {
      console.log("a");
      button.textContent = button.textContent == "Read" ? "Not Read" : "Read";
    })
  );
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

//Hide form if clicking outside of the form
divForm.addEventListener("click", removeForm, false);

function removeForm() {
  const bookForm = document.querySelector(".bookForm");
  bookForm.style.display = "none";
}
