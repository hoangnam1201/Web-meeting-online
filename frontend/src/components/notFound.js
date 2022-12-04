import React from 'react'
import { Link } from 'react-router-dom';
import imgLogo from "../assets/logomeeting.png";

const NotFound = () => {
  return (
    <div className=' mt-10 flex justify-center items-center'>
      <div className='bg-blue-300 p-10 w-96 rounded-full'>
        <Link to={'/'}>
          <img src={imgLogo} alt='logo' className='w-40 p-2 bg-white rounded-full ml-auto mr-auto' />
        </Link>
        <div className='text-white'>
          <p className='text-6xl'>404</p>
          <p className='text-4xl'>Not found</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound