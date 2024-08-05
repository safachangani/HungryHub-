import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '../../axios'; // Replace with your axios instance if needed

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    // Fetch order details using orderId
    const token = localStorage.getItem('token');
    if (orderId) {
      axios.get(`/users/get-order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setOrder(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No order ID found');
      setLoading(false);
    }
  }, [orderId]);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Order Details</h1>
      {order ? (
        <div style={styles.orderDetails}>
          <div style={styles.detailItem}>
            <strong>Order ID:</strong> {order._id}
          </div>
          <div style={styles.detailItem}>
            <strong>Status:</strong> {order.status}
          </div>
          <div style={styles.detailItem}>
            <strong>Total Price:</strong> ₹{order.totalPrice}
          </div>
          <div style={styles.detailItem}>
            <strong>Order Date:</strong> {new Date(order.date).toLocaleString()}
          </div>
          <div style={styles.detailItem}>
            <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
          </div>
          <div style={styles.detailItem}>
            <strong>Shipping Address:</strong>
            <p style={styles.address}>
              {order.address.StreetAddress}, {order.address.City}, {order.address.State} - {order.address.Pincode}
            </p>
          </div>
          <div style={styles.detailItem}>
            <strong>Order Items:</strong>
            <ul style={styles.itemsList}>
              {order.orderItems.map(item => (
                <li key={item._id} style={styles.item}>
                  <span>{item.productName}</span>
                  <span>{item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div style={styles.noOrder}>No order details found</div>
      )}
      <div style={styles.linkContainer}>
        <Link to="/home" style={styles.homeLink}>Back to Home</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  orderDetails: {
    lineHeight: '1.6',
  },
  detailItem: {
    marginBottom: '10px',
  },
  address: {
    margin: '0',
  },
  itemsList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    padding: '10px 0',
  },
  loading: {
    textAlign: 'center',
    margin: '20px 0',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    margin: '20px 0',
  },
  noOrder: {
    textAlign: 'center',
    margin: '20px 0',
  },
  linkContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  homeLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  },
};

export default OrderDetails;
