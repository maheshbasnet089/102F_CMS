const express = require('express')
const app = express()
require('dotenv').config() // requiring dotenv and initiliazing it with default configuration 
const cookieParser = require('cookie-parser')
const sanitizeHtml = require("sanitize-html")
const rateLimit  = require("express-rate-limit")
const helmet = require("helmet")


app.use(helmet())

// require express-session and connect-flash
const session = require("express-session")
const flash = require("connect-flash")
const html = "<strong>hello world</strong>";
console.log(sanitizeHtml(html));
//ROUTES HERE 
const blogRoute = require("./routes/blogRoute")
const authRoute = require("./routes/authRoute")
const { decodeToken } = require('./services/decodeToken')

// database connection 
require("./model/index")

const rateLimiter = rateLimit({
    windowMs :2 * 60 * 1000,
    limit : 3,
    message : "You have exceeded the requesting limit try again after 2 minutes"
})

app.use("/forgotPassword", rateLimiter)
app.use(session({
    secret : "helloworld",
    resave : false,
    saveUninitialized : false,
  
}))

app.use(flash())

// telling the nodejs to set view-engine to ejs
app.set('view engine','ejs')

// nodejs lai  file access garna dey vaneko hae yo code lay 
app.use(express.static("public/"))
app.use(express.static("uploads/"))

app.use(cookieParser())
// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(async(req,res,next)=>{
    res.locals.currentUser = req.cookies.token
    const token = req.cookies.token 
    if(token){
        const decryptedResult = await decodeToken(token,process.env.SECRETKEY)
        if(decryptedResult && decryptedResult.id){
            res.locals.currentUserId = decryptedResult.id
        }
    }

    next()
})


app.use("",blogRoute) // localhost:3000 + /createBlog === localhost:3000/createBlog
app.use("",authRoute) //localhost:3000/register



app.listen(3000,()=>{
    console.log("NodeJs project has started at port 3000")
})

// to clear git cached 
// git rm -r --cached node_modules(folderName)