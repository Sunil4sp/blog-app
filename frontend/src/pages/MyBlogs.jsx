import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to retrieve a post");
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

  const retrievePost = async () => {
    
      const userId = getUserIdFromToken();  // Get the logged-in user ID from the token
      if (!userId){ 
        setError("User ID not found in token.");
        return;
        }
      console.log("Fetching blogs for user ID:", userId);
      
    try {
      const response = await axios.get(
        `http://localhost:8000/fetchBlogs/${userId}`,
        {
          headers: {
            Authorization: `Bearer {localStorage.getItem("userId")}`/* ${userId}`*/,
          },
        }
      );

      // Handle success
      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.blogs)) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error retrieving post:", error);
      setError(error.response?.data?.message || "Error retrieving blogs");
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      retrievePost();
    }
  }, []);

  return (
    <div
      className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md: h-auto w-3/4 p-4 mt-6 
      grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl"
    >
      <div className="text-center tracking-widest">My Blogs Space</div>
      <label className="underline tracking-wider">Blog's Title :</label>
      <div className="grid grid-flow-row auto-rows-auto border-2 border-solid">
      {blogs.length > 0 ? (
        <div className="grid grid-flow-row auto-rows-auto border-2 border-solid p-2">
        {blogs.map((blog) => (
          <div key={blog._id}
            className="grid grid-flow-col border-2 border-dashed tracking-wider hover:bg-gray-500 hover:tracking-widest"
          > 
            <Link to={`/post/${blog._id}`}>
              <h3 className="hover:text-white">{blog.title}</h3>
            </Link>
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

export default MyBlogs;
