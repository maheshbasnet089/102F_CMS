const { users } = require("../../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../../services/sendEmail")

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
   
    const {email,password}= req.body
    // SERVER SIDE VALIDATION 
    if(!email || !password){
        return res.send("Email and password are required")
    }

//    findByPk -> {} ,findAll -> [{}]
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
        // GENERATE TOKEN HERE 

        const token = jwt.sign({id:associatedDataWithEmail[0].id},process.env.SECRETKEY,{
            expiresIn : '30d'
        })
        res.cookie('token',token) // browser ma application tab vitra cookie vanney ma save hunchha

        res.send("Logged In success")
       }else{
        res.send("Invalid password")
       }

    }
    // exist xaina vaney - > [],xa vaney [{name:"",password:"",email:"",id:""}]

}


exports.logOut = (req,res)=>{
    res.clearCookie('token')
    res.redirect("/login")
}

// forgot password

exports.forgotPassword = (req,res)=>{
    res.render("forgotPassword")
}

exports.checkForgotPassword = async (req,res)=>{
    const email = req.body.email
    if(!email){
        return res.send("Please provide email")
    }

    // if email -> users Table check with that email 
   const emailExists =  await  users.findAll({
        where : {
            email : email
        }
    })
    if(emailExists.length == 0){
        res.send("User with that email doesn't exist")
    }else{
        const generatedOtp = Math.floor(10000 * Math.random(9999))
        console.log(generatedOtp)
        // tyo email ma otp pathauney
      await  sendEmail({
            email : email,
            subject : "Forgot Password OTP",
            otp : generatedOtp
        })
        emailExists[0].otp = generatedOtp
        emailExists[0].otpGeneratedTime = Date.now()
        await emailExists[0].save()

        res.redirect("/otp?email=" + email)

    }
}


exports.renderOtpForm = (req,res)=>{
    const email = req.query.email 

    res.render("otpForm",{email : email})
}

exports.handleOTP = async (req,res)=>{
    const otp = req.body.otp
    const email = req.params.id
    if(!otp || !email){
        return res.send("Please send email,otp")
    }
   const userData = await users.findAll({
        where :{
            email : email,
            otp : otp
        }
    })
    if(userData.length ==0){
        res.send("Invalid Otp")
    }else{
       const currentTime = Date.now()  // current time
       const otpGeneratedTime = userData[0].otpGeneratedTime // past time
   
       if(currentTime - otpGeneratedTime <= 120000){
        userData[0].otp = null 
        userData[0].otpGeneratedTime = null
        await userData[0].save()

        res.redirect("/passwordChange")
       }else{
        res.send("Otp has expired")
       }
    }

}


exports.renderPasswordChangeForm = (req,res)=>{
    res.render("passwordChangeForm")
}