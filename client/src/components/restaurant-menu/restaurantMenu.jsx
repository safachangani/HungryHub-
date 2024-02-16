import React, { useEffect, useState } from 'react'
import './restaurant-menu.css'
import axios from '../../axios'
function RestaurantMenu() {
  const [menus,setMenus]=useState([])
  useEffect(()=>{
    const restaurantToken = localStorage.getItem('restaurant-token')
    axios.get('/restaurant-menu',{
      headers:{
        'Authorization':`Bearer ${restaurantToken}`
      }
    }).then((response)=>{
      console.log(response.data.response);
      setMenus(response.data.response)
      
    }).catch((err)=>{
      console.log(err);
    })
  },[])
  return (
   <div className="container">
     <h2>MENU LIST</h2>
       <div className="menu-carts">
       {menus.map((menu)=>{
        return(

          <div className="menu-cart" key={menu._id}>
             <img src={`http://localhost:9000/${menu.imageName}`} alt="" />
            <div className='item-details'>
                <span className="item-name">{menu.itemName}</span>
                <div className="item-cat-price">
                <span className="item-category">{menu.category}</span>
                <span className="item-price">Price {menu.price}</span>
                </div>
                <hr />
                <div className="buttons">
                <a href="#" className="button edit" id='edit-btn'>Edit</a>
                <a href="#" className="button delete" id='delete-btn'>Delete</a>
                </div>
            </div>
        </div>
           )
})}

       </div>
          
   
      
   </div>
  )
}

export default RestaurantMenu
