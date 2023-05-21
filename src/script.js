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
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./styles.css";

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
    loadBooks();
  } else {
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");
    signInButtonElement.removeAttribute("hidden");
    clearLibrary();
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
let bookFormElement = document.getElementById("book-form");
let bookFormContainer = document.querySelector(".bookForm");
let mainContentContainer = document.getElementById("library");
let displayFormBtnElement = document.querySelector(".addNewBook");

//Sign in and out button functionality
signInButtonElement.addEventListener("click", signIn);
signOutButtonElement.addEventListener("click", signOutUser);

//Form submit functionality
bookFormElement.addEventListener("submit", onBookFormSubmit);
displayFormBtnElement.addEventListener("click", displayForm);

function displayForm() {
  bookFormContainer.style.display = "flex";
  if (!isUserSignedIn()) {
    if (!bookFormElement.querySelector("#form-error")) {
      let errorMessage = document.createElement("span");
      errorMessage.textContent = "Sign in to add a book!";
      errorMessage.style.color = "red";
      errorMessage.id = "form-error";
      bookFormElement.appendChild(errorMessage);
    }
  } else {
    if (bookFormElement.querySelector("#form-error")) {
      bookFormElement.removeChild(document.getElementById("form-error"));
    }
  }
}

//Prevent clicks on the form to propagate up to parent div
bookFormContainer.addEventListener("click", (e) => e.stopPropagation(), true);

//Hide form if clicking outside of the form
bookFormContainer.addEventListener(
  "click",
  () => {
    bookFormContainer.style.display = "none";
  },
  false
);

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
function loadBooks(user) {
  //create query to load all books
  const booksQuery = query(
    collection(getFirestore(), "books"),
    orderBy("title")
  );

  //Start listening to query
  let endSnapshot = onSnapshot(booksQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let book = change.doc.data();
        displayBook(book, change.doc.id);
      } else if (change.type === "removed") {
        deleteBookfromDB(change.doc.id);
      }
    });
  });

  onAuthStateChanged(getAuth(), (user) => {
    if (!user) {
      endSnapshot();
    }
  });
}

function displayBook(book, bookId) {
  let div = newBookTile(book, bookId);
  mainContentContainer.appendChild(div);

  let activeDiv = document.getElementById(div.id);
  addRemoveBtnFunctionality(activeDiv);
  addReadBtnFunctionality(activeDiv);
}

function addRemoveBtnFunctionality(element) {
  //Add remove button status
  let removeBtn = element.querySelector(".remove");
  removeBtn.addEventListener("click", deleteBook);
}

function addReadBtnFunctionality(element) {
  let readBtn = element.querySelector(".readStatus");
  readBtn.setAttribute(
    "data-readStatus",
    readBtn.textContent === "Read" ? "true" : "false"
  );
  readBtn.addEventListener("click", setBookReadStatus);
}

function setBookReadStatus(event) {
  let bookReadBtn = event.target;

  if (bookReadBtn.getAttribute("data-readStatus") === "true") {
    bookReadBtn.setAttribute("data-readStatus", false);
  } else {
    bookReadBtn.setAttribute("data-readStatus", true);
  }
  bookReadBtn.textContent =
    bookReadBtn.getAttribute("data-readStatus") === "true"
      ? "Read"
      : "Not Read";
  bookReadBtn.className =
    bookReadBtn.getAttribute("data-readStatus") === "true"
      ? "readStatus read"
      : "readStatus unread";
  let bookId = bookReadBtn.parentNode.id;
  updateDoc(
    doc(getFirestore(), "books", bookId),
    "readStatus",
    bookReadBtn.getAttribute("data-readStatus") === "true" ? "Read" : "Not Read"
  );
}

function newBookTile(book, bookId) {
  let bookContainer = document.createElement("div");
  bookContainer.className = "card";
  bookContainer.id = bookId;

  let bookTitle = document.createElement("h1");
  bookTitle.classList.add("bookTitle");
  bookTitle.textContent = book.title;

  let author = document.createElement("h2");
  author.classList.add("author");
  author.textContent = book.author;

  let numPages = document.createElement("p");
  numPages.classList.add("numPages");
  numPages.textContent = book.pagesRead;

  let btnReadStatus = document.createElement("button");
  btnReadStatus.classList.add("readStatus");
  btnReadStatus.textContent = book.readStatus;

  let btnRemove = document.createElement("button");
  btnRemove.classList.add("remove");
  btnRemove.textContent = "Remove";

  bookContainer.append(bookTitle, author, numPages, btnReadStatus, btnRemove);

  return bookContainer;
}

function deleteBook(event) {
  let bookId = event.target.parentNode.id;
  let book = document.getElementById(bookId);
  if (book) {
    deleteBookfromDB(bookId);
    book.parentNode.removeChild(book);
  }
}

async function deleteBookfromDB(bookId) {
  await deleteDoc(doc(getFirestore(), "books", bookId))
    .then(() => {
      console.log("Document deleted");
    })
    .catch((error) => {
      console.log(error);
    });
}

function clearLibrary() {
  while (mainContentContainer.firstChild) {
    mainContentContainer.removeChild(mainContentContainer.firstChild);
  }
}

initFirebaseAuth();
