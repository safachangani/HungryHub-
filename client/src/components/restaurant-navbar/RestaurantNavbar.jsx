import React from 'react'
import './restaurant-navbar.css'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import User from '../../images/user.png'
function RestaurantNavbar() {
  return (
    <div className='rest-nav-bar'>
      <div className="icon-input">
        <span className='s-icon'><SearchOutlinedIcon/></span>
        <input type="search" placeholder="Search" />
      </div>
      <div className="right">
        <NotificationsActiveOutlinedIcon />
        <img src={User} alt="" srcset="" />
      </div>
    </div>
  )
}

export default RestaurantNavbar
