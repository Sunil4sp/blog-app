const express = require("express");

const {
  addBlog,
  deleteBlog,
  updateBlog,
  getComment,
  addComment,
  addVote,
  fetchBlogsByUser,
} = require("../controllers/blogs");

const { fetchUser } = require("../middlewares/fetchUser");

const router = express.Router();
router.use(fetchUser);

router.get("/fetchBlogsByUser/:id", fetchUser, fetchBlogsByUser);
router.post("/addblog/:id", addBlog);
router.delete("/deleteblog/:id", fetchUser, deleteBlog);
router.put("/update/:id", updateBlog);
router.post("/addcomment/:id", addComment);
router.get("/getcomment/:id", getComment);
router.post("/vote/:id", addVote);

module.exports = router;
