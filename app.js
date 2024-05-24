const express = require("express");
const app = express();
const morgan = require("morgan")
const ejs = require("ejs");
const path = require("path");
const helmet  = require("helmet");
const  xss  = require("xss-clean");
const ratelimit = require("express-rate-limit");
const hpp = require("hpp");
const connectToDb = require("./config/db_connect");
const { categoryPath } = require("./routes/category");
const {authPath} =require("./routes/user")
const port = process.env.port || 8080 ;
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;  //You only load a specific strategy from Passport.js (google)

//middleware
if(process.env.node_env === "development"){
    app.use(morgan("dev"));
}
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//connectdb

connectToDb()


app.use(passport.initialize()) // Configure and configure Passport.js to react to Express requests arriving at the application on global app

// view engine
app.set("view engine","ejs"); // Sets the EJS rendering engine as the default rendering engine for the application.
// يضبط محرك عرض EJS كمحرك العرض الافتراضي للتطبيق.


app.set("view",path.join(__dirname,"./views")) // Set the path to the folder containing the template files (page files) that will be displayed to the user.
//  بتعيين المسار إلى المجلد الذي يحتوي على ملفات القالب (ملفات الصفحات) التي سيتم عرضها للمستخدم.




// security headers
app.use(helmet())




 //The user will not enter any script code such as JavaScript or etc.. 
 app.use(xss())




//It specifies that the user only sends specific requests at a specific time

app.use(ratelimit({
    windowMs : 10 * 60 *1000 ,
    max : 500,
    message: "Too many login attempts. Please try again later.",

}))



//prevent http param pollution
app.use(hpp())


// allow cors
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );






app.use("/api/vi/category",categoryPath)

app.use("/api/vi/auth",authPath)










const server = app.listen(port,()=>{
    console.log(`Server Is Running on port ${port} `)
})















