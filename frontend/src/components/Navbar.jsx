import React, { useState, useEffect } from 'react';
import { /* Form, */ Link, useNavigate } from 'react-router-dom';
import {BsSearch} from 'react-icons/bs';
import {FaBars} from 'react-icons/fa';
import Menu from './Menu';
import axios from 'axios';
/* import { UserContext } from '../context/UserContext'; */

const Navbar = () => {
const [prompt, setPrompt] = useState("");
const [user, setUser] = useState(null);
const [menu, setMenu] = useState(false);
const navigate = useNavigate();
/* const path = useLocation().pathname; */

const showMenu = () =>{
  setMenu(!menu)
}

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
          console.log(response.data.user);
          
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
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4 bg-white text-black my-1 border-b-2 bg-orange-50'>
        <div className='flex flex-col flex-wrap wrap'>
          <h1 className='text-lg md:text-xl font-extrabold'>
            <Link to="/">Tasty Talks</Link>
          </h1>
          <h2>
            <Link to="/">Put down your thoughts</Link>
          </h2>
        </div>
        
        { /* path === '/' && */ <div onChange={(e) => setPrompt(e.target.value)} className='flex justify-center items-center space-x-0'>
          {/* <Form onSubmit={navigate(`/search?q=${encodeURIComponent(prompt)}`)}>
          <input className='outline outline-1 rounded-l-md px-3 text-black bg-white' placeholder='Search a post' type='text'/> */}
          {/* <p onClick={() => navigate(prompt ? "search?q=" + prompt : navigate(`/fetchblogs/${user._id}`)) } className='cursor-pointer outline outline-1 py-1 px-1 bg-white text-black rounded-r-md'> */}
          {/* <p onClick={() => {
              if (prompt.trim()) {
                navigate(`/search?q=${encodeURIComponent(prompt)}`);
              }
            }}
            className='cursor-pointer outline outline-1 py-1 px-1 bg-white text-black rounded-r-md'
          >  
            <BsSearch />
          </p> </Form>*/}
          <form onSubmit={(e) => {
                e.preventDefault();
                if (prompt.trim()) {
                  navigate(`/search?q=${encodeURIComponent(prompt)}`);
                }
              }} className='flex'>
              <input
                className='outline outline-1 rounded-l-md px-3 text-black bg-white'
                placeholder='Search a post'
                type='text'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                className='cursor-pointer outline outline-1 py-1 px-1 bg-white text-black rounded-r-md'
              >
                <BsSearch />
              </button>
            </form>

          </div>} 

          <div className='hidden md:flex items-center justify-center space-x-2 md:space-x-4 text-black'>
            {
              user ? (
              <h3 className='hover:font-bold'> 
                <Link to={`/fetchblogs/${user._id}`}>My blogs</Link>
              </h3>
              ) : (
              <h3>
                <Link to={'/login'}>Login</Link>
              </h3>)
            }
            
            { user ? (
              <div className="relative">{/* onClick={showMenu}> */}
              {/* <p className='cursor-pointer relative'></p> */}
              <button onClick={showMenu} className="flex items-center space-x-2 cursor-pointer">
                <FaBars className="text-xl"/>
                </button>
                {menu && (
                  <div className="absolute right-0 top-full z-50 mt-2">
                    <Menu setMenu= {setMenu} />
                    </div>
                    )}
            </div>
            ) : (
            <h3> <Link to='/register'>Register</Link></h3>
            )}
          </div>
      </div>
    </>
  )
}

export default Navbar