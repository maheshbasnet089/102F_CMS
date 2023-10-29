// code for handling errors asynchoronous

module.exports = (fn) => {
    return (req, res,next) => {
      fn(req, res,next).catch((err) => {
        res.send(err.message)
      //  const path  =req.route.path
      //   console.log(err.message)
      //   req.flash("error","Something went wrong")
      //   res.redirect(path)
      //   return

      });
    };
  };