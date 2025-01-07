import React from 'react';

const Footer = () => {
  return (
    <div className='md:container-sm px-10 space-x-4 bg-slate-50 mt-2 mx-auto grid grid-cols-3 rounded w-3/4 h-auto text-sm font-mono font-semibold text-slate-500'>
      <div className='p-4'>
          <h3 className='text-center'>TASTY TALKS</h3>
        <div className='space-y-5'>
          <ul className='list-none px-6 py-4'>
            <li>Who We Are</li>
            <li>About Us</li>
            <li>Consulting</li>
          </ul>
        </div>
      </div>
      <div className='p-4'>
        <h3 className='text-center'>QUICK LINKS</h3>
        <ul className='list-none px-6 py-4'>
          <li>My Story</li>
          <li>Contact US</li>
          <li>FAQs</li>
          <li>Shipping Policy</li>
          <li>Terms of Service</li>
          <li>Careers Blog</li>
        </ul>
      </div>
      <div className='p-4'>
        <h3 className='text-center'>STAY IN TOUCH</h3>
        <h4 className='py-1.5'>Subscribe to receive updates, access to excludive deals, and more</h4>
        <div className='space-y-4'>
          <input type='text' placeholder='Enter your Email Address' className='border w-72 h-8 md:w-36' />
          <button className='bg-stone-900 py-2 px-3 hover:text-white hover:bg-slate-500'>SUBSCRIBE</button>
        </div>    
      </div>
    </div>
  )
}

export default Footer;