import React, { useState, useEffect } from "react";
/* import { useNavigate } from "react-router-dom"; */
import axios from "axios";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  /* const navigate = useNavigate(); */

  const retrievePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to retrieve a post");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/fetchAllBlogs",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      console.log("Post retrieved successfully:", response.data);
      setUsers(response.data.posts);
      //navigate(`/myblogs/${response.data.userId}`);  // Redirect to user's blogs
    } catch (error) {
      console.error("Error retrieving post:", error);
      setError(error.response?.data?.message || "Error retrieving post");
    }
  };

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
        <div className="grid grid-flow-col justify-center gap-4">
          <button className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md">
            Edit a blog
          </button>
          <button className="bg-sky-500 hover:bg-sky-700 hover:text-white px-4 py-2 w-fit rounded-lg shadow-md">
            Delete a blog
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MyBlogs;
