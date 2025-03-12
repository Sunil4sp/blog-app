const express = require("express");

const { addBlog, deleteBlog, updateBlog, getComment, addComment, addVote, fetchAllBlogs, fetchBlogsByUser } = require("../controllers/blogs");
const { fetchUser } = require("../middlewares/fetchUser");

const router = express.Router();

router.use(fetchUser);

/* router.post('/', fetchAllBlogs); */

/* router.get('/fetchBlogsByUser/:id', fetchBlogsByUser); */

router.get('/', fetchBlogsByUser);

router.post('/addblog/:id', addBlog);

router.delete('/delete/:id', deleteBlog);

router.put('/update/:id', updateBlog);

router.post('/addcomment/:id', addComment);

router.get('/getcomment/:id', getComment);

router.post('/vote/:id', addVote);

module.exports = router;