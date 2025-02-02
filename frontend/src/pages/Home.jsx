import React, { useState, useEffect } from 'react';
import axios from 'axios';
/*import CreatePost from './CreatePost';
 import Loader from '../components/Loader'; */
import Login from './Login';
import MyBlogs from './MyBlogs';

const Home = () => {
  const [user, setUser] = useState(null);

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

  return (
    <>
      {user ? (
          <MyBlogs /> )
      :
      ( 
        <Login />)
      }
    </>
  )
}

export default Home;