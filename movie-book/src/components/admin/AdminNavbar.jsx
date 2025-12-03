import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:x-10 h-16 nav-glass'>
      <Link to="/">
        <img src={assets.brandLogo} alt='Movie-Hub' className='w-48 md:w-56 h-auto'/>
      </Link>
    </div>
  )
}

export default AdminNavbar
