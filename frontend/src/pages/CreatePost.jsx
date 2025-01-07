import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to handle post creation
  const handlePost = async () => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }

    // Make a request to create the post
    try {
      const response = await axios.post('http://localhost:8000/posts', 
        { title, description }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Handle success
      console.log("Post created successfully:", response.data);
      navigate(`/myblogs/${response.data.userId}`);  // Redirect to user's blogs

    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Error creating post');
    }
  };
  return (
    <>
      <div className="md:container-sm bg-slate-50 md:mx-auto bg-slate-50 columns-1 md:box-content h-auto w-3/4 mt-6 grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
        <div className="md:container md:mx-auto px-4 mb-6 gap-8 items-center justify-between">
          <h3 className="text-center underline underline-offset-4 pb-12 font-semibold">CREATE A BLOG</h3>
          <label className='pr-20 text-center font-medium'>Blog Title :</label>
          <input
            className="px-4 py-3 rounded-sm shadow-sm hover:shadow-md border-2"
            placeholder="Blogs Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="md:container md:mx-auto px-4 mb-6 gap-8 flex-1 items-center justify-between">
          <label className='pr-8 font-medium'>Blog Description :</label>
          <textarea
            className="px-4 py-3 rounded-sm shadow-sm hover:shadow-md border-2"
            cols="46"
            placeholder="Hello How are you all!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}{" "}
        {/* Error message */}
        <div className="md:container md:mx-auto px-4 mb-6 flex flex-row items-center justify-center bg-slate-50 gap-4">
          <button 
            onClick={handlePost}
            className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 shadow-md rounded-lg shadow-md">
            Post
          </button>
          <button 

            className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 shadow-md rounded-lg shadow-md">
            Edit
          </button>
        </div>
      </div>
    </>
  );
}

export default CreatePost