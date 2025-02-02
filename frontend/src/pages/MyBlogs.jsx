import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyBlogs = () => {
  const [users, setUsers] = useState([]);
  const [ title, setTitle ] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const retrievePost = async () =>{
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to retrieve a post');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/fetchAllBlogs', 
        { title, description }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Handle success
      console.log("Post retrieved successfully:", response.data);
      //navigate(`/myblogs/${response.data.userId}`);  // Redirect to user's blogs

    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Error creating post');
    }
  }
  return (
    <div className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md:box-content h-auto w-3/4 p-4 mt-6 
      grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
      <div className="text-center">My Blogs</div>
      <div className="grid grid-cols-2">
      {users.map((user) => (
        <div key={user.id} onLoad={retrievePost}>{user.title}
          {user.description}
        </div>
      ))}
      </div>
    </div>
  );
};

export default MyBlogs;
