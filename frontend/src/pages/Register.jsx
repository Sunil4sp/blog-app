import React, { useState } from 'react';
import '../App.css';
import { useForm } from "react-hook-form";
import axios from "axios";
import { URL } from '../url';
import { Link } from 'react-router-dom';

const Register = () => {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => { 
    try{
      const response = await axios.post(URL + "/signup", data);
      console.log("Registration Done:", response.data);
      // Update users state only after successful registration
      setUsers([...users, response.data]); // Assuming response has user data
    } catch(error){
      console.error("Error submitting data:", error);
    }
    console.log("Registration Done",data); 
  }

  /* useEffect(()=>{
    axios.post(URL + "/signup")
    .then(response => setUsers(response.data))
    .catch(error=> console.error("error fetching users:", error));
  }, []) */
  return (
    <div className='bg-blue-50 flex flex-col items-center  px-6 md:container md:mx-auto px-4 columns-1 md:box-content h-auto w-auto p-4 border-2 mt-6'>
       <h2 className="font-serif text-base font-normal text-opacity-100">REGISTRATION FORM</h2>
        <div className='md:container flex flex-col items-center justify-center m-4'>
            <form className="flex flex-col /* items-center justify-center */ m-4 w-6/12" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("username")} className='border-2 p-4 rounded-lg m-4 w-11/12' placeholder='Enter username' />
                <input type="email" {...register("email", { required: true })} className='border-2 p-4 rounded-lg m-4 mb-2 w-11/12' placeholder='Enter Email' />
                {errors.email && <span style={{ color: "red",position: "absolute",left: "400px"}}>
                    *Email* is mandatory </span>}
                <input type="password" {...register("password")} className='border-2 p-4 rounded-lg m-4 mt-8 w-11/12 my-6' placeholder='Enter Password' />
                <input type={"submit"} className='p-4 rounded-lg m-4 w-6/12' style={{ backgroundColor: "#a1eafb" }} />
            </form>    
            <div className='md:container flex flex-row items-between justify-evenly content-between m-4'>
                <Link to='/login'><button type="submit" className='bg-blue-300 p-4 rounded-lg m-4 w-8/12'>Login</button> </Link>
                <Link to="/register"><button type="submit" className='bg-blue-300 p-4 rounded-lg m-4 w-8/12'>Register</button></Link>
            </div>
        </div>    
      {users.map(user =>(
        <div key={user.id}>{user.name}</div>
      ))} 
      
      </div>
   
  )
}

export default Register