import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
    const { id } = useParams();  // Get the blog ID from the URL
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
            const response = await axios.get(`http://localhost:8000/posts/${id}`);  // Fetch the blog by ID
            setBlog(response.data.post);
            } catch (error) {
            setError('Error retrieving blog details');
            console.error(error);
            }
        };
    
        fetchBlogDetail();
      }, [id]);  // This effect will run whenever the blog ID changes
    
    if (error) return <p>{error}</p>;
    if (!blog) return <p>Loading...</p>; 

    return (
    <div className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md:box-content h-auto w-3/4 p-4 mt-6 
    grid border-slate-100 bg-slate-50 border-2 border-solid p-4 m-2px dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
        <div className="text-center tracking-widest">Blogs</div>
        <label>Title:</label>
        <div className='grid grid-flow-row auto-rows-auto border-2 border-solid p-4 m-2px font-semibold'>
            <h1>{blog.title}</h1>
        </div>
        <label>Description:</label>
        <div className='grid grid-flow-row auto-rows-auto border-2 border-solid p-4 m-2px italic'>
            <p>{blog.description}</p>
        </div>
    </div>
    )
}

export default BlogDetail;