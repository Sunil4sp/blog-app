import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [dislikedBlogs, setDislikedBlogs] = useState([]);
    const [dislikeCounts, setDislikeCounts] = useState({});
    const navigate = useNavigate();

        const getUserIdFromToken = () => {
            const token = localStorage.getItem("token");
            if (!token) {
            setError("You must be logged in to read a post");
            return null;
            }
            try {
            const decodedToken = jwtDecode(token);
            /* console.log("Decoded token:", decodedToken); */
            return decodedToken?.id || decodedToken?._id || decodedToken?.userId; // Adjust if your ID is stored differently
            } catch (error) {
            console.error("Invalid token:", error);
            setError("Invalid token");
            return null;
            }
        };

    const retrievePost = async () =>{
        /* const userId = getUserIdFromToken(); */
        const token = localStorage.getItem("token");
        if (!token) {
        setError('You must be logged in to retrieve a post');
        return;
        }
        /* console.log("Fetching All blogs: ", token); */
        try {
        const response = await axios.get('http://localhost:8000/fetchAllBlogs', 
            /* { title, description },  */
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

        // Handle success
        console.log("Post retrieved successfully:", response.data);
        navigate(`/fetchAllBlogs`);  // Redirect to all user's blogs    
        if (response.data && Array.isArray(response.data.blogs)) {
            setBlogs(response.data.blogs);
            const likes = {};
            const dislikes = {};

            response.data.blogs.forEach(blog => {
                likes[blog._id] = blog.upvote;
                dislikes[blog._id] = blog.downvote;
            });

            setLikeCounts(likes);
            setDislikeCounts(dislikes);
        } else {
            setBlogs([]);
        }

        } catch (error) {
        console.error('Error retrieving post:', error);
        setError(error.response?.data?.message || 'Error creating post');
        }
    }

    const voteBlog = async (blogId, voteType) => {
        const token = localStorage.getItem("token");
        const decodedUserId = getUserIdFromToken();
        try {
        const response = await axios.post(
            `http://localhost:8000/addVote/${blogId}`,
            { voteType },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        const updatedBlog = response.data.blog;
        console.log(response.data.blog);

        setLikeCounts(prev => ({ ...prev, [blogId]: updatedBlog.upvote }));
        setDislikeCounts(prev => ({ ...prev, [blogId]: updatedBlog.downvote }));

        // Update liked/disliked states
        const voted = updatedBlog.votedBy.find(v => v.userId?.toString() === decodedUserId); // You might store the decoded user id

        if (!voted) {
            setLikedBlogs(prev => prev.filter(id => id !== blogId));
            setDislikedBlogs(prev => prev.filter(id => id !== blogId));
        } else if (voted.type === "upvote") {
            setLikedBlogs(prev => [...new Set([...prev, blogId])]);
            setDislikedBlogs(prev => prev.filter(id => id !== blogId));
        } else if (voted.type === "downvote") {
            setDislikedBlogs(prev => [...new Set([...prev, blogId])]);
            setLikedBlogs(prev => prev.filter(id => id !== blogId));
        }

        } catch (error) {
        console.error("Voting error:", error.response?.data || error.message);
        }
    };
    
    useEffect(() => {
        retrievePost();
    }, []);

    return (
        <div
        className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md: h-auto w-3/4 p-4 mt-6 
        grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl"
        >
        <div className="text-center tracking-widest pb-4">Blogs Collection</div>
        <label className="tracking-wider pb-4">Blog:</label>
        <div className="grid grid-flow-row auto-rows-auto /* border-2 border-solid */">
        {blogs.length > 0 ? (
            <div className="grid grid-flow-row auto-rows-auto /* border-2  border-solid*/ p-2">
            {blogs.map((blog) => (
            <div key={blog._id}
                className="grid grid-flow-col /* tracking-wider */"
            > 
            <div className='px-1 justify-items-center w-full border-2 border-solid'>
                <Link to={`/post/${blog._id}`}>
                <h3 className="px-4 hover:text-white hover:bg-gray-500">{blog.title}..............</h3>
                </Link>
            </div>
                <div className="grid grid-flow-col justify-items-center content-around gap-4 w-full border-2">
                <div className='px-1 justify-items-center'>

                    <ThumbUpAltOutlinedIcon alt='Like' onClick={() =>  voteBlog(blog._id, "upvote")}
                    style={{
                        color: likedBlogs.includes(blog._id) ? "blue" : "gray",
                        cursor: "pointer",
                    }}
                    /> 
                    <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                        {likeCounts[blog._id] || 0}
                    </span>
                </div>
                <div className='px-1 justify-items-center'>

                    <ThumbDownOffAltOutlinedIcon alt='Dislike' onClick={() => 
                    voteBlog(blog._id, "downvote")}
                    style={{
                    color: dislikedBlogs.includes(blog._id) ? "blue" : "gray",
                    cursor: "pointer",
                    }} />
                    <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                        {dislikeCounts[blog._id] || 0}
                    </span>
                </div>
                <div className='px-1 justify-items-center'>
                            <ModeCommentOutlinedIcon alt='Comment' />
                </div>
                </div>
            </div>
            ))}
            
            </div>
        ) : (
            <p className="text-center mt-4 text-gray-500">No blogs found.</p>
        )}
    
        </div>
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
};

export default AllBlogs;
