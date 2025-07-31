import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const Footer = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        // Make a request to get user details
        axios
          .get(`http://localhost:8000/profile/${id}`, {
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
    <div className='md:container-sm px-10 space-x-4 bg-slate-50 mt-2 mx-auto grid grid-cols-3 rounded w-3/4 h-auto text-sm font-mono font-semibold text-slate-500'>
      <div className='p-4'>
          <h3 className='text-center'>TASTY TALKS</h3>
        <div className='space-y-5'>
          <ul className='list-none px-6 py-4'>
            <li>Who We Are</li>
            <li>About Us</li>
            <li>Consulting</li>
          </ul>
        </div>
      </div>
      <div className='p-4'>
        <h3 className='text-center'>QUICK LINKS</h3>
        <ul className='list-none px-6 py-4'>
          <Link /* to={`/fetchblogs/${user.id}`} */><li>My Blog</li></Link>
          <li>Contact US</li>
          <li>FAQs</li>
          <li>Shipping Policy</li>
          <li>Terms of Service</li>
          <li>Careers Blog</li>
        </ul>
      </div>
      <div className='p-4'>
        <h3 className='text-center'>STAY IN TOUCH</h3>
        <h4 className='py-1.5'>Subscribe to receive updates, access to excludive deals, and more</h4>
        <div className='space-y-4'>
          <input type='text' placeholder='Enter your Email Address' className='border w-72 h-8 md:w-36' />
          <button className='bg-stone-900 py-2 px-3 hover:text-white hover:bg-slate-500'>SUBSCRIBE</button>
        </div>    
      </div>
    </div>
  )
}

export default Footer;