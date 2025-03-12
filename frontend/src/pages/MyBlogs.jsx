import React, { useState, useEffect } from "react";
/* import { useNavigate } from "react-router-dom"; */
import axios from "axios";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const MyBlogs = () => {
  const [users, setUsers] = useState([]);
  /* const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); */
  const [error, setError] = useState("");
  /* const navigate = useNavigate(); */

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to retrieve a post");
      return null;
    }
    const decodedToken = jwtDecode(token); // Decode the JWT to get the user info
    console.log('Decoded token:', decodedToken);
    return decodedToken.id;  // Assuming the ID is in the "id" field of the token
  };

  const retrievePost = async () => {
    /* const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to retrieve a post");
      return;
    } */
      const userId = getUserIdFromToken();  // Get the logged-in user ID from the token
      if (!userId) return;
      console.log(userId);
      
    try {
      const response = await axios.get(
        `http://localhost:8000/fetchBlogsByUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Handle success
      console.log("Post retrieved successfully:", response.data);
      setUsers(response.data.blogs);
      //navigate(`/myblogs/${response.data.userId}`);  // Redirect to user's blogs
    } catch (error) {
      console.error("Error retrieving post:", error);
      setError(error.response?.data?.message || "Error retrieving post");
    }
  };

  /* const updateBlog = async (id, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update a blog.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/updateBlog/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // After successful edit, maybe redirect or update the state
    } catch (error) {
      console.error("Error updating blog:", error);
      setError(error.response?.data?.message || "Error updating blog");
    }
  };

  const deleteBlog = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete a post");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/deleteBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After deletion, re-fetch posts
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== blogId));
      console.log("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError(error.response?.data?.message || "Error deleting blog");
    }
  }; */

  useEffect(() => {
    retrievePost(); // Fetch posts when the component is mounted
  }, []);

  return (
    <div
      className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md:/* box-content */ h-auto w-3/4 p-4 mt-6 
      grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl"
    >
      <div className="text-center tracking-widest">My Blogs</div>
      <label className="underline tracking-wider">Blog's Title :</label>
      <div className="grid grid-flow-row auto-rows-auto border-2 border-solid">
        {users.map((user) => (
          <div
            key={user._id}
            className="grid grid-flow-col border-2 border-dashed tracking-wider hover:bg-gray-500 hover:tracking-widest"
          >
            <Link to={`/blog/${user._id}`}>
              <h3 className="hover:text-white">{user.title}</h3>
            </Link>
          </div>
        ))}
        {/* <div className="grid grid-flow-col justify-center gap-4">
          <button onClick={(user) => updateBlog(user._id)} className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md">
            Edit a blog
          </button>
          <button onClick={(user) => deleteBlog(user._id)} className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md">
            Delete a blog
          </button>
        </div> */}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MyBlogs;
