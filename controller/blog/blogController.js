const { blogs, users } = require("../../model")

exports.renderCreateBlog = (req,res)=>{
    res.render("createBlog")
}

exports.createBlog = async (req,res)=>{

    
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

// database ma halnu paryo , database sanaga kehi operation await halnu parney hunchha 
// agadi , await halepaxi mathi async halnu parney hunchha 
await blogs.create({
    title : title,
    subTitle:subTitle,
    description : description,
    userId : req.userId,
    image : process.env.PROJECT_URL + fileName
})
res.redirect("/")
// res.json({
//     status : 200,
//     message : "Blog created sucesfully"
// })
}

exports.allBlog = async (req,res)=>{
    //blogs vanney table bata vayejati sabai data dey vaneko 
    const allBlogs = await blogs.findAll() 


    // blogs vanney key/name ma allBlogs/data pass gareko ejs file lai
    res.render('blogs',{blogs:allBlogs})
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
//         type : QueryTypes.DELETE
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