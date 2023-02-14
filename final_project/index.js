const express = require("express")
const jwt = require("jsonwebtoken")
const session = require("express-session")
const customer_routes = require("./router/auth_users.js").authenticated
const genl_routes = require("./router/general.js").general

const app = express()

app.use(express.json())

app.use(
	"/customer",
	session({
		secret: "fingerprint_customer",
		resave: true,
		saveUninitialized: true,
	})
)

app.use("/customer/auth/*", function auth(req, res, next) {
	//Write the authenication mechanism here
	// console.log(req.session)
	if (!req.session.authorization) {
		// if user is not logged in
		return res.status(403).json({
			message: "Log in required!",
		})
	} else {
		let accessToken = req.session.authorization["accessToken"]

		jwt.verify(accessToken, "access", (err, user) => {
			if (!err) {
				req.user = user
				next()
			} else {
				// if user is not authorized
				return res.status(403).json({
					message: "Unauthorized User!",
				})
			}
		})
	}
})

const PORT = 5000

app.use("/customer", customer_routes)
app.use("/", genl_routes)

app.listen(PORT, () => console.log("Server is running"))
