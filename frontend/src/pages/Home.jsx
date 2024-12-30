import React from 'react';
import CreatePost from './CreatePost';
import { UserContext } from '../context/UserContext';
import { useContext } from "react";
import Loader from '../components/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? (
      <>
        <Header />
        <CreatePost /> 
        <Footer />
      </>) : 
        <Loader />}
    </>
  )
}

export default Home;