import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [uname, setUname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:8000/login',
      { username: uname, 
        email: email, 
        password: password
      });

      localStorage.setItem('token', response.data.token);

      console.log("Login Successful:", response.data);
      setIsLoggedIn(true);

      navigate('/');
    } catch(err){
      console.error("Error logging in:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  }
    
  return (
    <div>
      <div className="md:container flex flex-col items-center justify-center m-4">
        <h2 className="font-serif text-base font-normal text-opacity-100 text-blue-500">
          LOGIN
        </h2>
        <form
          className="flex flex-col items-center justify-center m-4 w-6/12"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            className="border-2 p-4 rounded-lg m-4 w-11/12"
            placeholder="Enter username"
            value={uname}
            onChange={(e) =>setUname(e.target.value)}
          />
          <input
            type="email"
            className="border-2 p-4 rounded-lg m-4 mb-2 w-11/12"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
          />
          <input
            type="password"
            className="border-2 p-4 rounded-lg m-4 mt-8 w-11/12 my-6"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <input
            type={"submit"}
            className="p-4 rounded-lg m-4 w-6/12"
            style={{ backgroundColor: "#a1eafb" }}
            value="Login"
          />
          <h4>*if not having account</h4>
          <Link to="/register">
            <button
              className="p-4 rounded-lg m-4 w-64"
              style={{ backgroundColor: "#a1eafb" }}
            >
              Register
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
