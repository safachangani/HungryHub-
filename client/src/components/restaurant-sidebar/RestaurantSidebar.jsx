import React, { useState } from 'react';
import './side-bar.css';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from '@mui/material';

function RestaurantSidebar({handlePageChange}) {
  
  const handleLinkClick = (page) => {
    
  };



  return (
    <div className="control">
      <div className="restaurant-profile">
        <h2>HungryHub</h2>
      </div>
      <div className="list">
        <ul className="restaurant-management">
          <li tabIndex="0" className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Dashboard')}>
              <SpaceDashboardOutlinedIcon className="custom-icon" /> <span> Dashboard</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Order')}>
              <RoomServiceOutlinedIcon className="custom-icon" /> <span> Order</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Menu')}>
              <MenuBookOutlinedIcon className="custom-icon" /> <span> Menu</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Messages')}>
              <ChatBubbleOutlineOutlinedIcon className="custom-icon" /> <span> Messages</span>
            </Link>
          </li>
          <li className="restaurant-element">
            <Link tabIndex="0" onClick={() => handlePageChange('Profile')}>
              <ManageAccountsOutlinedIcon className="custom-icon" /> <span>Profile</span>
            </Link>
          </li>
        </ul>
        <ul className="restaurant-management">
          <li className="restaurant-element" id="logout">
            <Link tabIndex="0">
              <LogoutIcon className="custom-icon" /><span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
   
    </div>
  );
}

export default RestaurantSidebar;
