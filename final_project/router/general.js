const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get the book list available in the shop using Promise callbacks with Axios
public_users.get('/async', function (req, res) {
  axios.get('http://localhost:5000/')
    .then((response) => {
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: 'Unable to fetch books list' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
 });

// Get book details based on ISBN using Promise callbacks with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: 'Unable to fetch book details by ISBN' });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchedBooks = {};

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchedBooks[key] = books[key];
    }
  });

  return res.status(200).send(JSON.stringify(matchedBooks, null, 4));
});

// Get book details based on author using Promise callbacks with Axios
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get(`http://localhost:5000/author/${author}`)
    .then((response) => {
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: 'Unable to fetch book details by author' });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchedBooks = {};

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      matchedBooks[key] = books[key];
    }
  });

  return res.status(200).send(JSON.stringify(matchedBooks, null, 4));
});

// Get all books based on title using Promise callbacks with Axios
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch(() => {
      return res.status(500).json({ message: 'Unable to fetch book details by title' });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
