import React from 'react';
import Navbar from '../components/Navbar';
import CreatePost from './CreatePost';

const Home = () => {
  return (
    <>
      <Navbar />
      <CreatePost />
      {/* <div className='md:container-sm md:mx-auto px-4 columns-1 md:box-content h-32 w-96 p-4 mt-6 grid bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl'>
        <div className='md:container md:mx-auto px-4 mb-6 gap-8 items-center justify-between bg-gray'>
          <input className='px-4 py-3 rounded-sm shadow-sm hover:shadow-md border-2' placeholder='Blogs Title' />
        </div>
        <div className='md:container md:mx-auto px-4 mb-6 gap-8 flex-1 items-center justify-between bg-gray'>
          <textarea className='px-4 py-3 rounded-sm shadow-sm hover:shadow-md border-2' cols='46' placeholder='Hello How are you all!'></textarea>
        </div>
          <div className='md:container md:mx-auto px-4 mb-6 flex flex-row items-center justify-center bg-gray gap-4'>
            <button className='bg-sky-500 hover:bg-sky-700 px-4 py-2 shadow-md rounded-full shadow-md'>Post</button>
            <button className='bg-sky-500 hover:bg-sky-700 px-4 py-2 shadow-md rounded-full shadow-md'>Edit</button>
          </div>
        </div> */}
    </>
  )
}

export default Home;