import React, { useEffect, useState, useContext } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from '../../axios';
import { UserLoginContext } from '../context/useContext';
import LocationPopup from '../location/LocationPopup';

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserLoginContext);
  const [userName, setUserName] = useState('Account');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [changeBackgroundColor, setChangeBackGroundColor] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  let userId;

  const handleMouseEnter = () => setChangeBackGroundColor(true);
  const handleMouseLeave = () => setChangeBackGroundColor(false);
  const countStyle = { backgroundColor: changeBackgroundColor ? '#fc8019' : '#68a720' };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken);
      setUserName(decodedToken.FullName);
      userId = decodedToken._id;

      axios.post('/users/get-total-count', { userId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        setTotalCount(response.data.response.totalCount);
      }).catch((err) => {
        if (err.response.status) {
          setTotalCount(0);
        }
      });
    }
  }, []);
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Use useNavigate to redirect to the login page
    navigate('/login');
    console.log("Logged out and redirected to login");
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const handleOutsideClick = (e) => !e.target.closest('.dropdown') && setDropdownOpen(false);

  useEffect(() => {
    if (dropdownOpen) document.addEventListener('click', handleOutsideClick);
    else document.removeEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  return (
    <div className='navbar'>
      <div className='nav location'>
        <Link to="/home" id='logo'>HungryHub</Link>
        <Link onClick={() => setPopupOpen(true)}>Location</Link>
      </div>

      <ul className="main-nav nav">
        <li>
          <Link to="/faq" className='search icon'>
            <i className="fa-regular fa-life-ring"></i>
            <span>Help</span>
          </Link>
        </li>
        <Link to={{ pathname: `/add-to-cart`, state: { userName } }} className='search icon' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {totalCount !== 0 && <span className="count" style={countStyle}>{totalCount}</span>}
          <span>Cart</span>
        </Link>
        <li className="dropdown">
          <div className='search icon' onClick={toggleDropdown}>
            <i className="fa-regular fa-user"></i>
            <span>{userName}</span>
          </div>
          {dropdownOpen && (
            <ul className="drop-nav">
              <li><Link to="/order-history">Orders</Link></li>
              <li onClick={handleLogout}><Link>{userName === 'Account' ? 'Login' : 'Logout'}</Link></li>
            </ul>
          )}
        </li>
      </ul>

      {popupOpen && <LocationPopup onClose={() => setPopupOpen(false)} userId={userId} />}
    </div>
  );
}

export default NavBar;
