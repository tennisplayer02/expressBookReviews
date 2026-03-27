const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
	const authHeader = req.headers.authorization || "";
	const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	const sessionToken = req.session?.authorization?.accessToken;
	const token = bearerToken || sessionToken;

	if (!token) {
		return res.status(403).json({ message: "User not authenticated" });
	}

	return jwt.verify(token, "access", (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "User not authenticated" });
		}

		req.user = decoded;
		return next();
	});
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
