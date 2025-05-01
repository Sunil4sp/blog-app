import React, { lazy, Suspense} from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserContextProvider from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

//=============================================Function Starts===========================================================
const Loader = lazy(() => import('./components/Loader'));
/* const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register')); */
const CreatePost = lazy(() => import('./pages/CreatePost'));
const ProfilePictureUpload = lazy(() => import('./pages/ProfilePictureUpload'));
const EditPost = lazy(() => import('./pages/EditPost'));
const MyBlogs = lazy(() => import('./pages/MyBlogs'));
const Profile = lazy(() => import('./pages/Profile'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

const App = () => {
  return (
    <UserContextProvider>
      <Header /> 
      <Routes>
        <Route exact path='/home' element= { <Home /> } />
        <Route exact path='/login' element= { <Login /> } /> 
        <Route exact path='/register' element= { <Register /> } />
        </Routes>
        <Suspense fallback= {<Loader />}>
      
      <Routes>
        {/* <Route exact path='/home' element= { <Home /> } />
        <Route exact path='/login' element= { <Login /> } /> 
        <Route exact path='/register' element= { <Register /> } /> */}
        <Route exact path='/create' element= { <CreatePost /> } />
        <Route exact path='/uploadProfilePicture/:id' element= { <ProfilePictureUpload /> } />
        <Route exact path='/edit/:id' element= { <EditPost /> } />
        <Route exact path='/fetchblogs/:id' element= { <MyBlogs /> } />
        <Route exact path='/profile/:id' element= { <Profile /> } />
        <Route exact path='/post/:id' element={ <BlogDetail /> } />
        <Route exact path='/' element= { <Home /> } />
      </Routes>
      </Suspense>
      <Footer />
    </UserContextProvider>
  );
}

export default App;
