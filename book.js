// Book class

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // remove in 5 secs
    setTimeout(() => document.querySelector(".alert").remove(), 3500);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (books.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// EVENTS

// display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // prevent actual submit ?????
  e.preventDefault();

  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate fields
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Enter all fields to continue", "danger");
  } else {
    // instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    // add book to list
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert("Book has been added", "success");

    // clear fields
    UI.clearFields();
  }
});

// remove a book from ui
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  //remove book from storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show success message
  UI.showAlert("Book has been removed", "success");
});
