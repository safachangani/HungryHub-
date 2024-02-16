import React, { useEffect, useState } from 'react'
import './restaurant-profile.css'
import axios from '../../axios'
function RestaurantProfile() {
    const [profile,setProfile] = useState({})
    useEffect(()=>{
        const restaurantToken = localStorage.getItem('restaurant-token')
        axios.get('/restaurant-profile',
        {
            headers:{
                'Authorization':`Bearer ${restaurantToken}`
            }
        }).then((response)=>{
            console.log(response.data.profile);
            setProfile(response.data.profile);

        }).catch((err)=>{
            console.log(err);
        })
    },[])
  return (
    
    <div className="profile-container">
    <div className="profile-header">
       
      <h1>{profile.RestaurantName}</h1>
      <h2> PROFILE</h2>
    </div>
    <div className="profile-info">
      <div className="info-section">
        <h2>Contact Information</h2>
        <p>Email: {profile.EmailAddress}</p>
        <p>Phone: {profile.OwnerNumber}</p>
        <p>Address: {profile.RestaurantAddress}</p>
        <p>Cuisine: {profile.CuisineType}</p>
      </div>
      <div className="info-section">
        <h2>Social Media</h2>
        <ul>
          <li>Instagram: @owner_insta</li>
          <li>Twitter: @owner_twitter</li>
        </ul>
      </div>
      {/* Add more sections as needed */}
    </div>
  </div>
  )
}

export default RestaurantProfile
