import React, { useState } from 'react'
import './restaurant-control.css'
import RestaurantPanel from '../../components/restaurant-panel/RestaurantPanel'
import RestaurantSidebar from '../../components/restaurant-sidebar/RestaurantSidebar'

function RestaurantControlPanel() {
  const [selectedPage,setSelectedPage]=useState('Dashboard')

  const handlePageChange=(page)=>{
    setSelectedPage(page)
  }
  return (
    
    <div className='restaurent-control-panel'> 

    <RestaurantSidebar handlePageChange={handlePageChange}></RestaurantSidebar>
     <RestaurantPanel selectedPage={selectedPage}></RestaurantPanel>
   
      <div></div>
    </div>
  )
}

export default RestaurantControlPanel
