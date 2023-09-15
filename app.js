const express = require('express')
const { blogs, sequelize } = require('./model/index')
const { QueryTypes } = require('sequelize')
const app = express()



// database connection 
require("./model/index")

// telling the nodejs to set view-engine to ejs
app.set('view engine','ejs')

// nodejs lai  file access garna dey vaneko hae yo code lay 
app.use(express.static("public/"))


// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json())
app.use(express.urlencoded({extended:true}))




// allBlog
app.get("/",async (req,res)=>{
    //blogs vanney table bata vayejati sabai data dey vaneko 
    const allBlogs = await blogs.findAll() 

    // blogs vanney key/name ma allBlogs/data pass gareko ejs file lai
    res.render('blogs',{blogs:allBlogs})
    // res.json({
    //     status : 200,
    //     blogs : allBlogs
    // })
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
    res.redirect("/")
    // res.json({
    //     status : 200,
    //     message : "Blog created sucesfully"
    // })
})

// single blog page 
app.get("/single/:id",async(req,res)=>{
const id = req.params.id
// second approach
// const {id} = req.params 
// id ko data magnu/find garnu paryo hamro table bata
const blog =  await blogs.findAll({
    where : {
        id : id
    }
})
// second finding approach
// const blog = await blogs.findByPk(id)

    res.render("singleBlog",{blog:blog})
})

// delete page 
app.get("/delete/:id",async (req,res)=>{
    const id = req.params.id
    // blogs vanney table bata tyo id ko delete gar vaneko yaha
     await blogs.destroy({
        where : {
            id : id
        }
    })
//    await  sequelize.query('DELETE FROM blogs WHERE id=?',{
//         replacements  : [id],
//         type : QueryTypes.DELETE
//     })
   res.redirect("/")
})


// EDIT BLOG
app.get("/edit/:id", async (req,res)=>{
    const id = req.params.id
    // find blog of that id 
const blog =    await  blogs.findAll({
        where : {
            id : id
        }
    })

    res.render("editBlog",{blog : blog})
})

app.post("/editBlog/:id",async (req,res)=>{
    const id = req.params.id
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description

    // first approach (X)
    // await  blogs.update(req.body,{
    //     where :{
    //         id : id
    //     }
    // })

    // second approach 
    await blogs.update({
        title : title,
        subTitle : subTitle,
        description : description
    },{
        where : {
            id : id
        }
    })

    res.redirect("/single/" + id)
})

app.listen(3000,()=>{
    console.log("NodeJs project has started at port 3000")
})