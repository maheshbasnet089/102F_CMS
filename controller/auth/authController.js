const { users } = require("../../model")
const bcrypt = require("bcryptjs")

exports.renderRegisterForm = (req,res)=>{
    res.render("register")
}
// Alternative to arrow function 
// exports.registerUser = function(req,res){
//     res.render("register")
// }

exports.registerUser = async(req,res)=>{
   const {email,username,password,confirmPassword} = req.body
   /*const email = req.body.email
   const password = req.body.password
   const username  = req.body.password*/

    // check if password matches with confirmPassword
    // if(password.toLowerCase() !== confirmPassword.toLowerCase()){
    //     return res.send("Password and confirmPassword doesn't matched")
    // }
    if(password !== confirmPassword){
         res.send("Password and confirmPassword doesn't matched")
         return
    }

   // INSERT INTO Table(users)
  await users.create({
    email,
    password : bcrypt.hashSync(password,8) ,
    username
   })
   res.redirect("/login")
}


// LOGIN Starts from here

exports.renderLoginForm = (req,res)=>{
    res.render("login")
}

exports.loginUser = (req,res)=>{
    console.log(req.body)
}
