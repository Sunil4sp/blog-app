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
    <div>
      {users.map(user =>(
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default Register