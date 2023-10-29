const sanitizeHtml = require("sanitize-html")


const sanitizer = (req,res,next)=>{
    console.log(req.body,"FROM SANITIZER")

   
    // req.body = {title:"asdf",subtitle:"sdfdf"}
    // loop object 
    for(const key in req.body){
       req.body[key] = sanitizeHtml(req.body[key],{
        allowedTags :['mark'],
        allowedAttributes : {}
       })
    }
    
    next()

}

module.exports = sanitizer