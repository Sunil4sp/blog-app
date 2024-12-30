import React from 'react';
import loadingGif from '../images/loading-slow-net.gif';

const Loader = () => {
  return (
    <div className='py-48 px-96'>
      <img src={loadingGif} alt='loading...' className='pl-48'/>
      </div>
  )
}

export default Loader;