import React, { useEffect, useState } from 'react';
import './location-popup.css';
import axios from '../../axios';

function LocationPopup({ onClose }) {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/users/location', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.location) {
          setLocation(response.data.location);
          setErrorMessage(''); // Clear any previous error message
        } else {
          setErrorMessage('You haven\'t added an address yet.');
        }
        console.log("Location data fetched successfully");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setErrorMessage('You don\'t have an account yet.');
        } else {
          setErrorMessage('An error occurred while fetching your location.');
        }
      });
    } else {
      setErrorMessage('You don\'t have an account yet.');
    }
  }, []);

  return (
    <div className="location-popup-backdrop">
      <div className="location-popup">
        <button className="close-btn" onClick={onClose}>X</button>
        {location ? (
          <div className="location-container">
            <h3>Your Location</h3>
            <div className="address-content">
              {location.StreetAddress}, {location.City}, {location.State} {location.Pincode}
            </div>
            <div className="delivery-type">{location.DeliveryType}</div>
          </div>
        ) : (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPopup;
