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
router.post("/addBlog/:id", addBlog);
router.delete("/deleteBlog/:id", fetchUser, deleteBlog);
router.put("/updateBlog/:id", updateBlog);
router.post("/addComment/:id", addComment);
router.get("/getComment/:id", getComment);
router.post("/vote/:id", addVote);

module.exports = router;
