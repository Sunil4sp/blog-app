import React, { lazy, Suspense} from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserContextProvider from './context/UserContext';

/* import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import MyBlogs from './pages/MyBlogs';
import Profile from './pages/Profile';
import Loader from './components/Loader'; */

//=============================================Function Starts===========================================================
const Loader = lazy(() => import('./components/Loader'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const EditPost = lazy(() => import('./pages/EditPost'));
const MyBlogs = lazy(() => import('./pages/MyBlogs'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <UserContextProvider>
      <Suspense fallback= {<Loader />}>
      <Routes>
        <Route exact path='/home' element= { <Home /> } />
        <Route exact path='/login' element= { <Login /> } />
        <Route exact path='/register' element= { <Register /> } />
        <Route exact path='/write' element= { <CreatePost /> } />
        <Route exact path='/Post/post/:id' element= { <PostDetails /> } />
        <Route exact path='/edit/:id' element= { <EditPost /> } />
        <Route exact path='/myblogs/:id' element= { <MyBlogs /> } />
        <Route exact path='/profile/:id' element= { <Profile /> } />
        <Route exact path='/' element= { <Home /> } />
      </Routes>
      </Suspense>
    </UserContextProvider>
  );
}

export default App;
