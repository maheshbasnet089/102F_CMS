const bcrypt = require("bcryptjs")

const seedAdmin  = async(users)=>{
    const isAdminExists = await users.findAll({
        where : {
          email : "admin@gmail.com"
        }
    
       })
       if(isAdminExists.length == 0 ){
        await users.create({
          email : "admin@gmail.com",
          username : "admin",
          password : bcrypt.hashSync('admin',10),
          role : "admin"
        })
        console.log("Admin seeded successfully")
       } else{
    
         console.log("admin already seeded")
       }
    
}

module.exports = seedAdmin