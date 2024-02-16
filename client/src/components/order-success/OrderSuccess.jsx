import React from 'react'
import './order-success.css'
import fastDelivery from '../../images/fast-delivery.png'
function OrderSuccess() {
  return (
    <div>
     <div className="success">
        <div className="order-success">
            <img src={fastDelivery} alt="order success" />
            <h2>Congratulations</h2>
         <span>your order Placed successfully</span>
         <button>Track Order</button>
        </div>
    </div> 
       
    </div>
  )
}

export default OrderSuccess
