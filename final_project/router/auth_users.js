const express = require("express")
const jwt = require("jsonwebtoken")
let books = require("./booksdb.js")
const regd_users = express.Router()

let users = []

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	let userswithsamename = users.filter((user) => user.username === username)
	// if there is no user with same username
	if (!userswithsamename.length) {
		return true
	} else {
		return false
	}
}

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let validUsers = users.filter((user) => {
		return user.username === username && user.password === password
	})
	if (validUsers.length > 0) {
		return true
	} else {
		return false
	}
}

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const { username, password } = req.body
	// if username or password is missing
	if (!username || !password) {
		res.status(400).json({ message: "Username or password is missing!" })
	}

	if (!authenticatedUser(username, password)) {
		// if username and password is not valid
		return res.status(401).json({ message: "Invalid credentials!" })
	} else {
		// if user is authenticated, save user credentials for session as JWT
		let accessToken = jwt.sign({ data: password }, "access", {
			expiresIn: 60 * 60,
		})
		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(300).json({ message: "User is logged in successfully!" })
	}
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(400).json({ message: "Username or password is missing!" })
	}

	if (!authenticatedUser(username, password)) {
		// if user is not authenticated
		return res.status(401).json({ message: "Invalid credentials!" })
	} else {
		// if user is authenticated
		let isbn = req.params.isbn
		let book = books[isbn]
		if (!book) {
			// if book was not found
			res
				.status(404)
				.json({ message: `Book with the isbn ${isbn} was not found!` })
		} else {
			// if book is found
			let userReview = req.body.reviews
			if (userReview) {
				book["reviews"] = userReview
			}
			books[isbn] = book
			res.send(`Reviews of book with isbn ${isbn} was updated successfully!`)
		}
	}
})

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(400).json({ message: "Username or password is missing!" })
	}

	if (!authenticatedUser(username, password)) {
		// if user is not authenticated
		return res.status(401).json({ message: "Invalid credentials!" })
	} else {
		// if user is authenticated
		let isbn = req.params.isbn
		if (!isbn) {
			res.status(400).json({ message: "ISBN not specified!" })
		} else {
			// if isbn exists, delete reviews
			delete books[isbn]["reviews"]
			res.send(`Reviews of book with isbn ${isbn} have been deleted.`)
		}
	}
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
