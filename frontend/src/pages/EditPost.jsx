import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const {id} = useParams();
  const [error, setError] = useState("");
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/post/${id}`);
        setBlog(response.data.post);
        setTitle(response.data.post.title);
        setDescription(response.data.post.description);
      } catch (err) {
        setError("Failed to fetch blog.");
      }
    };
    fetchBlog();
  }, [id]);

  const updateBlog = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update a blog.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/updateBlog/${id}`, { title, description }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog updated successfully!");
      navigate(`/fetchblogs/${id}`);
      // After successful edit, maybe redirect or update the state
    } catch (error) {
      console.error("Error updating blog:", error);
      setError(error.response?.data?.message || "Error updating blog");
    }
  };

  if (error) return <p>{error}</p>;
  if (!blog) return <p>Loading...</p>; 

  return (
    <div className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md:box-content h-auto w-3/4 p-4 mt-6 
    grid border-slate-100 bg-slate-50 border-2 border-solid p-4 m-2px dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
        <div className="text-center tracking-widest">Edit Blogs</div>
        <div className="mb-4">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      <div className="mb-4">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        
        <div className="grid grid-flow-col justify-center gap-4">
          <button onClick={updateBlog} className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md">
            Save a blog
          </button>
        </div>
    </div>
  )
}

export default EditPost