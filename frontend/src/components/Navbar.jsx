import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {BsSearch} from 'react-icons/bs';
import {FaBars} from 'react-icons/fa';
import Menu from './Menu';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
const [prompt, setPrompt] = useState("");
const [menu, setMenu] = useState(false);
const navigate = useNavigate();
const path = useLocation().pathname;

const showMenu = () =>{
  setMenu(!menu)
}
 const { user} = useContext(UserContext)

  return (
    <>
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4 bg-white text-black my-1 border-b-2'>
        <div className='flex flex-col flex-wrap wrap'>
          <h1 className='text-lg md:text-xl font-extrabold'>
            <Link to="/">Tasty Talk</Link>
          </h1>
          <h2>
            <Link to="/">Put down your thoughts</Link>
          </h2>
        </div>
        
        { path === '/' && <div onChange={(e) => setPrompt(e.target.value)} className='flex justify-center items-center space-x-0'>
          <input className='outline outline-1 rounded-l-md px-3 text-black bg-white' placeholder='Search a post' type='text'/>
          <p onClick={() => navigate(prompt ? "?search" + prompt : navigate("/")) } className='cursor-pointer outline outline-1 py-1 px-1 bg-white text-black rounded-r-md'>
            <BsSearch />
          </p>
          </div>}

          <div className='hidden md:flex items-center justify-center space-x-2 md:space-x-4 text-black' >
            {
              user ? <h3> <Link to='/write'>Write</Link></h3> : <h3>
                <Link to='/login'>Login</Link>
              </h3>
            }
            { user ? <div onClick={showMenu}>
              <p className='cursor-pointer relative'></p>
                <FaBars />
                {menu && <Menu />}
            </div> : <h3> <Link to='/register'>Register</Link></h3>
            }
          </div>
          
      </div>
    </>
  )
}

export default Navbar