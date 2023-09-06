const express = require('express')
const { blogs } = require('./model/index')
const app = express()



// database connection 
require("./model/index")

// telling the nodejs to set view-engine to ejs
app.set('view engine','ejs')


// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// allBlog
app.get("/",(req,res)=>{
    res.render('blogs')
})

//createBlog
app.get("/createBlog",(req,res)=>{
    res.render("createBlog")
})

//createBlog Post
app.post("/createBlog",async (req,res)=>{
    
        // second approach
        // const {title,description,subtitle} = req.body
    // first approach
    const title = req.body.title
    const description  = req.body.description
    const subTitle = req.body.subtitle
   
    // database ma halnu paryo , database sanaga kehi operation await halnu parney hunchha 
    // agadi , await halepaxi mathi async halnu parney hunchha 
    await blogs.create({
        title : title,
        subTitle:subTitle,
        description : description
    })



    res.send("form submitted sucessfully")
})

app.listen(3000,()=>{
    console.log("NodeJs project has started at port 3000")
})