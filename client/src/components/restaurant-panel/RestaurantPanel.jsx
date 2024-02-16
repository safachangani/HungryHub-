import React from 'react';
import RestaurantNavbar from '../restaurant-navbar/RestaurantNavbar';
import RestaurantOrder from '../../components/restaurant-order/RestaurantOrder';
import RestaurantMenu from '../../components/restaurant-menu/restaurantMenu';
import RestaurantProfile from '../restaurant-profile/RestaurantProfile';
import './restaurant-panel.css'
function RestaurantPanel({selectedPage}) {
  return (
    <div className='restaurent-panel'> 
      <RestaurantNavbar />
      {selectedPage==='Dashboard' && <></>}
      {selectedPage==='Order' && <RestaurantOrder  />}
      {selectedPage==='Menu' && <RestaurantMenu/>}
      {selectedPage==='Profile' && <RestaurantProfile/>}
      <div></div>
    </div>
  );
}

export default RestaurantPanel;