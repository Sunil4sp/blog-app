import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
/* import MyBlogs from './MyBlogs'; */
import AllBlogs from './AllBlogs';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Make a request to get user details
      axios
        .get("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user); // Set the user data if successful
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
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
          <AllBlogs /> )
      :
      ( 
        <Login />)
      }
    </>
  )
}

export default Home;