import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { getFirebaseConfig } from "../firebase-config.js";

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
initializeApp(firebaseConfig);

async function signIn() {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  signOut(getAuth());
}

function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), authStateObserver);
}

function authStateObserver(user) {
  if (user) {
    let profilePicUrl = getProfilePicUrl();
    let userName = getUserName();

    userPicElement.style.backgroundImage =
      "url(" + addSizeToGoogleProfilePic(profilePicUrl) + "?";
    userNameElement.textContent = userName;

    //Show user's profile and signout button
    userNameElement.removeAttribute("hidden");
    userPicElement.removeAttribute("hidden");
    signOutButtonElement.removeAttribute("hidden");
    signInButtonElement.setAttribute("hidden", true);
  } else {
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");
    signInButtonElement.removeAttribute("hidden");
  }
}

//Return signed-in user's profile pic url
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || "/images/profile_placeholder.jpg";
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

function getUserName() {
  return getAuth().currentUser.displayName;
}

function isUserSignedIn() {
  return !!getAuth().currentUser;
}

//Shortcut to Dom Elements
let userPicElement = document.getElementById("user-pic");
let userNameElement = document.getElementById("user-name");
let signInButtonElement = document.getElementById("sign-in");
let signOutButtonElement = document.getElementById("sign-out");
let submitButtonElement = document.getElementById("submit");
let bookFormElement = document.getElementById("book-form");

//Sign in and out button functionality
signInButtonElement.addEventListener("click", signIn);
signOutButtonElement.addEventListener("click", signOutUser);

//Form submit functionality
bookFormElement.addEventListener("submit", onBookFormSubmit);

function onBookFormSubmit(e) {
  e.preventDefault();
  let form = e.target;
  //check form values are all submitted and signed in
  if (checkFormValues(form) && isUserSignedIn()) {
    saveBook(getFormValues(form)).then(() => {
      resetForm(form);
    });
  }
}

function getFormValues(form) {
  let formData = new FormData(form);
  return Object.fromEntries(formData);
}

function checkFormValues(form) {
  let formValidity = true;
  [...form].forEach((elem) => {
    if (!elem.validity.valid) {
      formValidity = false;
    }
  });
  return formValidity;
}

function resetForm(form) {
  form.reset();
  form.parentElement.style.display = "none";
}

async function saveBook(formValues) {
  try {
    await addDoc(collection(getFirestore(), "books"), {
      title: formValues.bookTitle,
      author: formValues.bookAuthor,
      pagesRead: formValues.pagesRead,
      readStatus: formValues.readStatus,
    });
  } catch (error) {
    console.error("Error writing new book to Firebase Database", error);
  }
}

//Load books in library and listen for upcoming ones
function loadBooks() {
  //create query to load all books
  const booksQuery = query(
    collection(getFirestore(), "books"),
    orderBy("title")
  );

  //Start listening to query
  onSnapshot(booksQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let book = change.doc.data();
        console.log(book);
        displayBook(change.doc.id);
      } else if (change.type === "removed") {
        deleteBook(change.doc.id);
      }
    });
  });
}

function displayBook(id) {
  console.log(id);
}

let myLibrary = [];

//Constructor function for a book
// function Book(userInput) {
//   this.author = userInput[0];
//   this.title = userInput[1];
//   this.numPages = userInput[2];
//   this.read = userInput[3];
//   readToggle = function () {
//     this.read = this.read == "read" ? "unread" : "read";
//   };
// }
/*
const form = document.getElementById("book-form");
const titleField = document.getElementById("title");

titleField.addEventListener("input", (event) => {
  if (titleField.validity.tooShort) {
    titleField.setCustomValidity("Too short");
  } else if (titleField.validity.tooLong) {
    titleField.setCustomValidity("Too long");
  } else {
    titleField.setCustomValidity("");
  }
  titleField.reportValidity();
});

form.addEventListener("submit", (event) => {
  if (!titleField.validity.valid) {
    titleField.setCustomValidity("Wrong email");
    event.preventDefault();
  }
});
*/
class Book {
  constructor(userInput) {
    this.author = userInput[0];
    this.title = userInput[1];
    this.numPages = userInput[2];
    this.read = userInput[3];
  }
  readToggle() {
    this.read = this.read == "read" ? "unread" : "read";
  }
}

//Function that takes the user input and adds to the library
function addBookToLibrary(userInput) {
  let newBook = new Book(userInput);
  myLibrary.push(newBook);
}

/*
const bookSubmit = document.getElementById("book-form");
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
*/

//Function that loops through myLibrary and displays each book as a card
function displayBooks() {
  const mainContent = document.querySelector(".mainContent");
  mainContent.innerHTML = "";
  let counter = 0;
  for (let book of myLibrary) {
    book.index = counter;
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
    btnReadStatus.setAttribute("data-index", counter);
    btnReadStatus.textContent = book.read;
    bookDisp.appendChild(btnReadStatus);

    let btnRemove = document.createElement("button");
    btnRemove.classList.add("remove");
    btnRemove.setAttribute("data-index", counter);
    btnRemove.textContent = "Remove";
    bookDisp.appendChild(btnRemove);

    mainContent.appendChild(bookDisp);
    counter += 1;
  }

  //Function to change Read status on existing book and update book object in myLibrary array
  let readBtns = document.querySelectorAll(".readStatus");

  readBtns.forEach((button) =>
    button.addEventListener("click", () => {
      let updateBook = myLibrary.find(
        (book) => book.index == button.getAttribute("data-index")
      );
      updateBook.read = button.textContent == "Read" ? "Not Read" : "Read";
      button.textContent = button.textContent == "Read" ? "Not Read" : "Read";
    })
  );

  //Function remove a book and update myLibrary object indices
  let removeBtns = document.querySelectorAll(".remove");

  removeBtns.forEach((button) =>
    button.addEventListener("click", () => {
      let removeBook = myLibrary.find(
        (book) => book.index == button.getAttribute("data-index")
      );
      let indexRemovedBook = myLibrary.indexOf(removeBook);
      myLibrary.splice(indexRemovedBook, 1);
      displayBooks();
    })
  );
}

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
divForm.addEventListener(
  "click",
  () => {
    document.querySelector(".bookForm").style.display = "none";
  },
  false
);

initFirebaseAuth();
loadBooks();
