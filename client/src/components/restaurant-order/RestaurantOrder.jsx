import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './restaurant-order.css'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import axios from '../../axios';
function RestaurantOrder() {
    const [getOrders,setGetOrders]=useState([])

    useEffect(()=>{
        const restaurantToken = localStorage.getItem('restaurant-token')
        axios.get('/restaurant-orders',{
            headers:{
                'Authorization':`Bearer ${restaurantToken}`
            }
         }).then((response)=>{
                console.log(response.data.response);
                let order= response.data.response;
                setGetOrders(order)
            
       })
    },[])
  return (
    <div className='container'>
       <h2>Order list</h2>
       <div className="container-order">
        {getOrders.map((getOrder)=>(
            // {console.log(getOrder)}
            <div className="order-get" key={getOrder._id}>
            <div className="order">
                <span id='order-name'>Name:{getOrder.name}</span>
                <span id='order-id'>Order:{getOrder._id}</span>
                <span id='order-date'>{getOrder.date}</span>
            </div>
                {getOrder.menuItems.map((menu)=>(
            <div className="ordered-item" key={menu._id}>

                    <img src={`http://localhost:9000/${menu.imageName}`} alt="" />
                <div className="item">
                    <span id='item-name'>{menu.itemName}</span>
                    <div className="amount">
                        <span><CurrencyRupeeOutlinedIcon/><span id='rupee'>{menu.price}</span></span>
                        <span>Qty: {menu.quantity}</span>
                    </div>
                </div>
                
            </div>
                ))}
            <div className="request">
                <span>Total: <CurrencyRupeeOutlinedIcon/><span id='rupee'>{getOrder.totalPrice}</span></span>

                <div id='request-icons'>
                    <Link id='reject'><CloseOutlinedIcon/></Link>
                    <Link id='receive'><DoneOutlinedIcon/></Link>
                </div>
            </div>
       </div>

        ))}
      
          
   
       </div>
    </div>
  )
}

export default RestaurantOrder
