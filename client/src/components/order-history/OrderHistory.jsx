import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import './order-history.css';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      axios.get('/users/orders/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        console.log(response);
        setOrderHistory(response.data.orders);
        setIsLoading(false);
      }).catch((err) => {
        console.error('Error fetching order history:', err);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {isLoggedIn ? (
        orderHistory.length > 0 ? (
          orderHistory.map((order) => (
            <div key={order._id} className="order-card">
              <h3> {order.restaurantName}</h3>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
              <p>Total Price: ₹{order.totalPrice}</p>
              <div className="order-items">
                <h4>Items:</h4>
                {order.orderItems.map((item) => (
                  <div key={item.itemId} className="order-item">
                    {item.menuItem && <img src={`http://localhost:9001/hungryhub/uploads/${item.menuItem.imageName}`} alt={item.menuItem.itemName} className="order-item-image" />}
                    <div className="order-item-details">
                      <span>{item.menuItem ? item.menuItem.itemName : 'No Longer Available'}</span>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-address">
                <h4>Delivery Address:</h4>
                <p>{order.address.StreetAddress}, {order.address.City}, {order.address.State}, {order.address.Pincode}</p>
              </div>
              <div className="payment-method">
                <p>Payment Method: {order.paymentMethod}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders-container">
           
            <p className="no-orders-message">No past orders found.</p>
          </div>
        )
      ) : (
        <div className="no-orders-container">
        
          <p className="no-orders-message">Please log in to view your order history.</p>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
