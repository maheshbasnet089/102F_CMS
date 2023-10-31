const { blogs, users } = require("../../model")
const fs = require("fs") // fs->fileSystem

const nodeSchedule = require("node-schedule")

const db = require("../../model/index")
const { QueryTypes } = require("sequelize")
const sequelize = db.sequelize

exports.renderCreateBlog = (req,res)=>{
    res.render("createBlog")
}

exports.createBlog = async (req,res)=>{
    console.log(req.body,"From createBlog")

    
    //  const userId = req.user[0].id
    //  console.log(req.userId)
    // second approach
    // const {title,description,subtitle} = req.body
    // first approach
    const title = req.body.title
    const description  = req.body.description
    const subTitle = req.body.subtitle
    const fileName = req.file.filename
    if(!title || !description ||!subTitle || !req.file){
        return res.send(
            "Please provide title,description,subTitle,file"
        )
    }

// query to make separate blog table for each user 
// await sequelize.query(`CREATE TABLE IF NOT EXISTS blog_${req.userId}(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, title VARCHAR(255),subTitle VARCHAR(255),description VARCHAR(255),userId INT REFERENCES users(id) ,image VARCHAR(255))`,{
//     type  : QueryTypes.CREATE
// })

// // inserting data
// await sequelize.query(`INSERT INTO blog_${req.userId}(title ,subTitle,description,userId,image) VALUES(?,?,?,?,?)`,{
//     type : QueryTypes.INSERT,
//     replacements : [title,subTitle,description,req.userId,process.env.PROJECT_URL + fileName]
// })


// database ma halnu paryo , database sanaga kehi operation await halnu parney hunchha 
// agadi , await halepaxi mathi async halnu parney hunchha 
await blogs.create({
    title : title,
    subTitle:subTitle,
    description : description,
    userId : req.userId,
    image : process.env.PROJECT_URL + fileName
})


// await sequelize.query("INSERT INTO blogs(title,subTitle,description,userId,image) VALUES(?,?,?,?,?)",{
//     replacements : [title,subTitle,description,req.userId, process.env.PROJECT_URL + fileName],
//     type : QueryTypes.INSERT
// })

res.redirect("/")
// res.json({
//     status : 200,
//     message : "Blog created sucesfully"
// })
}

exports.allBlog = async (req,res)=>{
    const success = req.flash("success")
    //blogs vanney table bata vayejati sabai data dey vaneko 
    const allBlogs = await blogs.findAll()
//    const allBlogs = await sequelize.query("SELECT * FROM blogs ORDER BY ASC",{
//         type : sequelize.QueryTypes.SELECT
//     })
        


    // blogs vanney key/name ma allBlogs/data pass gareko ejs file lai
    res.render('blogs',{blogs:allBlogs,success })
    // res.json({
    //     status : 200,
    //     blogs : allBlogs
    // })
}

exports.singleBlog  = async(req,res)=>{
    const id = req.params.id
    // second approach
    // const {id} = req.params 
    // id ko data magnu/find garnu paryo hamro table bata
    const blog =  await blogs.findAll({
        where : {
            id : id
        },
        include : {
            model : users
        }
    })

    // const blog = await sequelize.query("SELECT * FROM blogs JOIN users ON blogs.id = users.id WHERE blogs.id = ? ",{
    //     replacements : [id],
    //     type : sequelize.QueryTypes.SELECT
    // } )
    // console.log(blog)
    // second finding approach
    // const blog = await blogs.findByPk(id)
    
        res.render("singleBlog",{blog:blog})
}

exports.deleteBlog = async (req,res)=>{
    const id = req.params.id
    // blogs vanney table bata tyo id ko delete gar vaneko yaha
     await blogs.destroy({
        where : {
            id : id
        }
    })
//    await  sequelize.query('DELETE FROM blogs WHERE id=?',{
//         replacements  : [id],
//         type : sequelize.QueryTypes.DELETE
//     })
   res.redirect("/")
}


exports.renderEditBlog = async (req,res)=>{
    const id = req.params.id
    // find blog of that id 
const blog =    await  blogs.findAll({
        where : {
            id : id
        }
    })

    res.render("editBlog",{blog : blog})
}

exports.editBlog = async (req,res)=>{
    // const userId = req.userId
    const id = req.params.id
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description
    // const oldDatas = await blogs.findAll({
    //     where : {
    //         id : id
    //     }
    // })
    // if(oldDatas[0].userId !== userId){
    //     return res.send("You cannot edit This blog")
    // }
    let fileUrl;
    if(req.file){
        fileUrl = process.env.PROJECT_URL + req.file.filename
        const oldImagePath = oldDatas[0].image
        // console.log(oldImagePath) // http://localhost:3000/1696256032339-attention.png
         const lengthOfUnwanted = "http://localhost:3000/".length
       const fileNameInUploadsFolder =  oldImagePath.slice(lengthOfUnwanted) // lengthOfUnwanted = 22
       fs.unlink("uploads/" + fileNameInUploadsFolder ,(err)=>{
        if(err){
            console.log("Error while deleting file",err)
        }else{
            console.log("File Delete Succesfully")
        }
       })
    }else{
        fileUrl = oldDatas[0].image // old fileUrl
    }
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
        description : description,
        image : fileUrl
    },{
        where : {
            id : id
        }
    })

    // fs.unlink('uploads/test.txt',(err)=>{
    //     if(err){
    //         console.log("error happened",err)
    //     }else{
    //         console.log("Delete successfully")
    //     }
    // })
  
    res.redirect("/single/" + id)
}


exports.renderMyBlogs = async (req,res)=>{
    // get this users blogs 
    const userId = req.userId;
    // find blogs of this userId 
    const myBlogs = await blogs.findAll({
        where : {
            userId : userId
        }
    })

    res.render("myBlogs.ejs",{myBlogs : myBlogs})
}

exports.renderSecret = (req,res)=>{
    nodeSchedule.scheduleJob('* * * * *', function(){
        // status role column update , undefined
        console.log('The answer to life, the universe, and everything!');
      });
    res.send("This is secret page only accessible to admin")
}

