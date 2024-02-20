import React, { useEffect, useState } from 'react';
import axios from "axios";
import { URL } from '../url';

const Register = () => {
  const [users, setUsers] = useState([]);
  useEffect(()=>{
    axios.post(URL + "/api/v1/signup")
    .then(response => setUsers(response.data))
    .catch(error=> console.error("error fetching users:", error));
  }, [])
  return (
    <div className='md:container md:mx-auto px-4 columns-1 md:box-content h-32 w-32 p-4 border-4 mt-6'>
      Hello
      {users.map(user =>(
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default Register