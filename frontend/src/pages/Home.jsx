import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className='w-full flex flex-row bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl'>
        <div className='gap-8 columns-2xs items-center justify-between bg-gray rounded-md'>
          <h3>Blog</h3>
        </div>
        <div className='gap-8 flex-1 items-center justify-between bg-gray rounded-md'>
          <h3>Hello How are you all!</h3>
        </div>
      </div>
    </>
  )
}

export default Home;