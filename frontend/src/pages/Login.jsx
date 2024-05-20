import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [users, setUsers] = useState([]);
  const onSubmit = (data) => {
    const {uname, pass} = data;
    const usercheck = users.find(user => (user.username === uname && user.password === pass));
        if(usercheck) {
          console.log("Login successful");
        }else {
          console.log("Wrong password or username");
        }
        console.log(usercheck);
        console.log(data);
      }
    
  return (
    <div>
      
      <div className='md:container flex flex-col items-center justify-center m-4'>
        <h2 className="font-serif text-base font-normal text-opacity-100 text-blue-500">LOGIN</h2>
            <form className="flex flex-col items-center justify-center m-4 w-6/12" onSubmit={onSubmit}>
                <input type="text" className='border-2 p-4 rounded-lg m-4 w-11/12' placeholder='Enter username' />
                <input type="email" className='border-2 p-4 rounded-lg m-4 mb-2 w-11/12' placeholder='Enter Email' />
                <input type="password" className='border-2 p-4 rounded-lg m-4 mt-8 w-11/12 my-6' placeholder='Enter Password' />
                <input type={"submit"} className='p-4 rounded-lg m-4 w-6/12' style={{ backgroundColor: "#a1eafb" }} />
            </form>  
      </div>  
    </div>
  );
};

export default Login;
