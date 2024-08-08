import React from 'react';
import './order-success.css';
import fastDelivery from '../../images/fast-delivery.png';

function OrderSuccess( {orderId}) {
  const handleTrackOrder = () => {
    // Redirect to the order tracking page or function
    window.location.href = '/track-order'; // Replace with actual tracking URL
  };
  console.log(orderId,"orderid");
  const handleViewOrderDetails = () => {
    // Redirect to the order details page or function
    window.location.href = `/order-details?orderId=${orderId}`; // Replace with actual order details URL
  };

  return (
    <div>
      <div className="success">
        <div className="order-success">
          <img src={fastDelivery} alt="order success" />
          <h2>Congratulations</h2>
          <span>Your order was placed successfully!</span>
          <div className="order-success-buttons">
            {/* <button onClick={handleTrackOrder}>Track Order</button> */}
            <button onClick={handleViewOrderDetails}>View Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;

