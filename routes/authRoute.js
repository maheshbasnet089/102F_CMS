const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logOut } = require("../controller/auth/authController");

const router = require("express").Router()

// app.get("/register",registerUser)
// app.post("/register",registerUser)

router.route("/register").get(renderRegisterForm).post(registerUser)

router.route("/login").get(renderLoginForm).post(loginUser)

router.route("/logout").get(logOut)

module.exports = router;



