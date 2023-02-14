const express = require("express")
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()

public_users.post("/register", (req, res) => {
	//Write your code here
	const username = req.body.username
	const password = req.body.password
	if (!username || !password) {
		// if username or password is missing
		return res
			.status(400)
			.json({ message: "Username and/or password not provided!" })
	} else if (!isValid(username)) {
		// if username is invalid
		return res.status(400).json({ message: "Username already exists!" })
	} else {
		// if everything is ok, add to "users" array
		users.push({ username: username, password: password })
		return res.send({ message: `Registered user ${username}!` })
	}
})

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
	//Write your code here
	const allBooks = await books
	return res.send(JSON.stringify({ allBooks }, null, 4))
})

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn
	const book = books[isbn]
	return res.send(JSON.stringify({ book }, null, 4))
})

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
	//Write your code here
	const author = req.params.author
	for (let key in books) {
		let book = await books[key]
		// if any book author matches author, send book in response
		if (book.author === author) {
			return res.send(JSON.stringify({ book }, null, 4))
		}
	}
	// if no book author matches author, send 404 error
	return res.status(404).json({ message: "Book not found!" })
})

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
	//Write your code here
	const title = req.params.title
	for (let key in books) {
		let book = await books[key]
		if (book.title === title) {
			res.send(JSON.stringify({ book }, null, 4))
		}
	}
	return res
		.status(404)
		.json({ message: `Book with title ${title} was not found` })
})

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
	//Write your code here
	const isbn = req.params.isbn
	const book = await books[isbn]
	if (!book) {
		return res.json({ message: `Book with isbn ${isbn} was not found!` })
	} else {
		return res.json(book.reviews)
	}
})

module.exports.general = public_users
