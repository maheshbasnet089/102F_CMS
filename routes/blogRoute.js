const { renderCreateBlog,renderMyBlogs, createBlog, allBlog, singleBlog, deleteBlog, editBlog, renderEditBlog } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router()

const { multer, storage } = require("../middleware/multerConfig");
const { isValidUser } = require("../middleware/validUser");
const catchError = require("../services/catchError");
const sanitizer = require("../services/sanitizer");
const upload = multer({ storage: storage });


// kohi createBlog ma gayo vaney k garney vaneko ho hae
// app.get("/createBlog",renderCreateBlog)
// app.post("/createBlog",createBlog)

router.route("/").get(allBlog)
router.route("/createBlog").get( catchError(isAuthenticated), catchError(renderCreateBlog)).post(isAuthenticated,upload.single('image'),sanitizer,  createBlog)
router.route("/single/:id").get(singleBlog)
router.route("/delete/:id").get(isAuthenticated,deleteBlog)
router.route("/editBlog/:id").post(isAuthenticated,isValidUser, upload.single('image'),sanitizer, editBlog)
router.route("/edit/:id").get(isAuthenticated,renderEditBlog)
router.route("/myblogs").get(isAuthenticated,renderMyBlogs)



// you can do this as well 
// router.route("/:id").get(singleBlog).post(editBlog)

// router.route("/:id").get().post().patch().delete()


module.exports = router;