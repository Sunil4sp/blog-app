const express = require("express");

const {
  addBlog,
  deleteBlog,
  updateBlog,
  getComment,
  addComment,
  addVote,
  fetchBlogsByUser,
  fetchAllBlogs
} = require("../controllers/blogs");

const { fetchUser } = require("../middlewares/fetchUser");

const router = express.Router();
router.use(fetchUser);

router.get("/fetchAllBlogs", fetchAllBlogs);
router.get("/fetchBlogsByUser/:id", fetchUser, fetchBlogsByUser);
router.post("/addBlog/:id", fetchUser, addBlog);
router.delete("/deleteBlog/:id", fetchUser, deleteBlog);
router.put("/updateBlog/:id", updateBlog);
router.post("/addComment/:id", addComment);
router.get("/getComment/:id", getComment);
router.post("/addVote/:id", fetchUser, addVote);

module.exports = router;
