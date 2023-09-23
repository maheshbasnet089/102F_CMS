const { renderCreateBlog, createBlog, allBlog, singleBlog, deleteBlog, editBlog, renderEditBlog } = require("../controller/blog/blogController");

const router = require("express").Router()

// kohi createBlog ma gayo vaney k garney vaneko ho hae
// app.get("/createBlog",renderCreateBlog)
// app.post("/createBlog",createBlog)

router.route("/").get(allBlog)
router.route("/createBlog").get(renderCreateBlog).post(createBlog)
router.route("/single/:id").get(singleBlog)
router.route("/delete/:id").get(deleteBlog)
router.route("/editBlog/:id").post(editBlog)
router.route("/edit/:id").get(renderEditBlog)




// you can do this as well 
// router.route("/:id").get(singleBlog).post(editBlog)

// router.route("/:id").get().post().patch().delete()


module.exports = router;