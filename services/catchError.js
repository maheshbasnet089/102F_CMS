// code for handling errors asynchoronous

module.exports = (fn) => {
    return (req, res,next) => {
      fn(req, res,next).catch((err) => {
       const path  =req.route.path
        
        req.flash("error","Something went wrong")
        res.redirect(path)
        return

      });
    };
  };