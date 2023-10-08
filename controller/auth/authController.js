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
   const error =  req.flash("error")
    res.render("login",{error })
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

        req.flash("success","Logged In Successfully")
        res.redirect("/")
       }else{
        req.flash("error","Invalid Password")
        res.redirect("/login")
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
        const generatedOtp = Math.floor(10000 * Math.random(99999))
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
        // userData[0].otp = null 
        // userData[0].otpGeneratedTime = null
        // await userData[0].save()
        

        // res.redirect("/passwordChange?email=" + email)
        res.redirect(`/passwordChange?email=${email}&otp=${otp}`)
       }else{
        res.send("Otp has expired")
       }
    }

}


exports.renderPasswordChangeForm = (req,res)=>{
    const email = req.query.email
    const otp = req.query.otp 
    
    if(!email || !otp){
        return res.send("Email and otp should be provided in the query")
    }
    res.render("passwordChangeForm",{email,otp})
}

exports.handlePasswordChange = async(req,res)=>{
    const email = req.params.email
    const otp = req.params.otp 
    const newPassword = req.body.newPassword
    const confirmNewPassword = req.body.confirmNewPassword
    if(!newPassword || !confirmNewPassword ||!email ||!otp){
        return res.send("Please provide newPassword,email and confirmNewPassword")
    }

    // checking if that emails otp or not
    const userData = await users.findAll({
        where :{
            email : email,
            otp : otp
        }
    })

    if(newPassword !== confirmNewPassword){
        res.send("newPassword and confirmNewPassword doesn't matched")
        return
   }


    if(userData.length ==0){
        return res.send("Dont try to do this")
    }
    const currentTime = Date.now()
    const otpGeneratedTime = userData[0].otpGeneratedTime 

    if(currentTime - otpGeneratedTime >= 120000){
    
        return res.redirect("/forgotPassword")
    }



   const hashedNewPassword = bcrypt.hashSync(newPassword,8)
   // MATCH vayo vaney 
//   const userData = await users.findAll({
//     email : email
//    })
//    userData[0].password = hashedNewPassword
//    await userData[0].save()

  await  users.update({
    password : hashedNewPassword
   },{
    where :{
        email : email
    }
   })
   res.redirect("/login")

}