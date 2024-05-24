const express = require("express");
const router = express.Router();
const {registerUser,verifyUserAccount,loginUser} =require("../controller/authentication")
const ratelimit = require("express-rate-limit");




// middleware put before routehandler (controller)
const loginLimter = ratelimit({
    windowMs : 10 * 60 *1000, // 15 minutes
    max : 10, // limit each IP to 5 login requests per windowMs
    message:"Too many login attempts. Please try again later.",
})


//create a limiter for forgot password requests
const forgotPasswordLimiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 forgot password requests per windowMs
    message: "Too many forgot password attempts. Please try again later.",
  });







router.route("/signandloginbygoogle").
get()



router.route("/register").
post(registerUser)

router.route("/login").
post(loginUser)


router.route("/:id/verify/:token").
get(verifyUserAccount)


module.exports={
    authPath:router
}