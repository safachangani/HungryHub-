import React from 'react';
import RestaurantNavbar from '../restaurant-navbar/RestaurantNavbar';
import RestaurantOrder from '../../components/restaurant-order/RestaurantOrder';
import RestaurantMenu from '../../components/restaurant-menu/restaurantMenu';
import RestaurantProfile from '../restaurant-profile/RestaurantProfile';
import './restaurant-panel.css'

function RestaurantPanel({ selectedPage }) {
  return (
    <div className='restaurant-panel'>
      <RestaurantNavbar />
      {selectedPage === 'Dashboard' && (
        <div className="under-construction">
          <h2>Under Construction</h2>
          <p>This page is currently under construction. Please check back later!</p>
        </div>
      )}
      {selectedPage === 'Order' && <RestaurantOrder />}
      {selectedPage === 'Menu' && <RestaurantMenu />}
      {selectedPage === 'Profile' && <RestaurantProfile />}
    </div>
  );
}

export default RestaurantPanel;
