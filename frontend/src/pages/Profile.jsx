import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() =>{
    const token = localStorage.getItem("token");
    if(token){
      axios.get(`http://localhost:8000/profile`,{
        headers:{
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response)=>{
        console.log("User data fetched: ", response.data.user);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        // If error occurs (e.g., token expired), remove the token and set user to null
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      });
    } else {
    setUser(null); // If there's no token, set user to null
    }
  },[navigate]);

  return (
    <>
    {user ? (
      <>
        <div className='flex flex-row border-0 bg-orange-50'>
          <div className='grid grid'></div>
          <div className='basis-1/4 border-r-2'>
              <div className='rounded-full p-8 flex flex-col grid justify-items-center'>
                {user.imageUrl ?(
                  <img src={user.imageUrl} alt='avatar' width={200} className='rounded-full'/>
                  ):( <img
                    src='https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png' // Placeholder image if no profile picture is available
                    alt='avatar'
                    width={200}
                    className='rounded-full'
                  />
                )}
                {/* Link to upload new profile picture */}
                <Link to={`/uploadProfilePicture/${user._id}`}>
                {/* {console.log(user._id)
                } */}
                  <button className='mt-2 bg-blue-500 text-white rounded px-4 py-2'>Change Picture
                  </button>
                </Link>
              </div>
          </div>
          <div className='basis-3/4 border-l-2 font-mono p-4 flex flex-col bg-blue-400 text-white'>
                <div className='pl-10 text-xl flex'>
                  Profile
                </div>
                <div className='text-sm'>
                {`Hello, ${user.username}!`}
                </div>
          </div>
          {/* <div className='basis-2/4 border-l-2 font-mono p-8 flex flex-col'>
          Graph
          </div> */}
        </div>

      </>
      ): <Loader />}
    </>
  )
}

export default Profile