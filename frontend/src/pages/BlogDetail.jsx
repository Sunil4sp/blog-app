import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [users, setUsers] = useState([]);
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/post/${id}`); // Fetch the blog by ID
            setBlog(response.data.post);
            console.log(response.data.post);
        } catch (error) {
            setError("Error retrieving blog details");
            console.error(error);
        }
    };

    fetchBlogDetail();
  }, [id]); // This effect will run whenever the blog ID changes

    const deleteBlog = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
        setError("You must be logged in to delete a post");
        return;
        }

        try {
        await axios.delete(`http://localhost:8000/deleteBlog/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

    // After deletion, re-fetch posts
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert("Blog deleted successfully");
        navigate("/");
        } catch (error) {
        console.error("Error deleting blog:", error);
        setError(error.response?.data?.message || "Error deleting blog");
        }
    };

    if (error) return <p>{error}</p>;
    if (!blog) return <p>Loading...</p>;

    return (
        <div
        className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md:box-content h-auto w-3/4 p-4 mt-6 
        grid border-slate-100 bg-slate-50 border-2 border-solid p-4 m-2px dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl"
        >
        <div className="text-center tracking-widest">Blog Details</div>
        <label>Title:</label>
        <div className="grid grid-flow-row auto-rows-auto border-2 border-solid p-4 m-2px font-semibold">
            <h1>{blog.title}</h1>
        </div>
        <label>Description:</label>
        <div className="grid grid-flow-row auto-rows-auto border-2 border-solid p-4 m-2px italic">
            <p>{blog.description}</p>
        </div>
        <div className="grid grid-flow-col justify-center gap-4">
            <Link to={`/edit/${blog._id}`}>
            <button
                className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md"
            >
                Edit a blog
            </button>
            </Link>
            <button
            onClick={deleteBlog}
            className="bg-red-500 hover:bg-red-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md"
            >
            Delete a blog
            </button>
        </div>
        </div>
    );
}

export default BlogDetail;