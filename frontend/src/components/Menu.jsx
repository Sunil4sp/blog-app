import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Menu = ({setMenu}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Make a request to get user details
      axios
        .get("http://localhost:8000/profile", {
          // This should be the endpoint to get the user's profile
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user); // Set the user data if successful
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
          // If error occurs (e.g., token expired), remove the token and set user to null
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      setUser(null); // If there's no token, set user to null
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      setMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className="bg-aqua w-[160px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-48 rounded-md p-4 space-y-4 shadow-inner bg-slate-50 hover:bg-blend-darken">
      {/* If the user is not logged in, show Login and Register */}
      {!user && (
        <>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer outline-stone-100 outline-white">
          <Link to="/login" onClick={() => setMenu(false)}>Login</Link>
        </h3>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/register" onClick={() => setMenu(false)}>Register</Link>
        </h3>
        </>
      )}
      {/* If the user is logged in, show Profile, Write, and My Blogs */}
      {user && (
        <>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/create" onClick={() => setMenu(false)}>Create blog</Link>
        </h3>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer">
          <Link to={`/profile/${user._id}`} onClick={() => setMenu(false)}>Profile</Link>
        </h3>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer">
          <Link to={`/fetchblogs/${user._id}`} onClick={() => setMenu(false)}>My Blogs</Link>
        </h3>
        <h3 className="text-black text-sm hover:text-gray-500 cursor-pointer">
          <Link to={`/fetchAllBlogs`} onClick={() => setMenu(false)}>Blogs Collection</Link>
        </h3>

      {/* Logout button is always visible if the user is logged in */}
        <h3
          className="text-black text-sm hover:text-gray-500 cursor-pointer"
          onClick={handleLogout}>
          Logout
        </h3>
      </>
      )}
    </div>
  );
};

export default Menu;
