const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // logic to validate the fileType(mimeType)
    const allowedFileTypes = ['image/png','image/jpeg','image/jpg']
    
    if(!allowedFileTypes.includes(file.mimetype)){
      cb(new Error("Invalid fileType.Only supports png,jpeg,jpg")) // cb(error)
      return;
    }

    cb(null, "./uploads/"); // c(a,b)=>success
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

module.exports = {
  multer,
  storage
};