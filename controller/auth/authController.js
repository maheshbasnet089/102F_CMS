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

exports.loginUser = async (req,res)=>{
    console.log(req.body)
    const {email,password}= req.body
    // SERVER SIDE VALIDATION 
    if(!email || !password){
        return res.send("Email and password are required")
    }

    // check if that email exists or not
   const associatedDataWithEmail =  await users.findAll({
       where : {
        email
       }
    })
    if(associatedDataWithEmail.length == 0){
         res.send("User with that email doesn't exists")
    }else{
          // check if password also matches
    const associatedEmailPassword = associatedDataWithEmail[0].password
       const isMatched =  bcrypt.compareSync(password,associatedEmailPassword) // true or false return
       if(isMatched){
        res.send("Logged In success")
       }else{
        res.send("Invalid password")
       }

    }


    // exist xaina vaney - > [],xa vaney [{name:"",password:"",email}]

}
