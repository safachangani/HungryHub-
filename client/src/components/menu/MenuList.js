import React, { useEffect, useState, useContext } from 'react';
import './menu.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { UserLoginContext } from '../context/useContext';

function MenuList() {
  const { user } = useContext(UserLoginContext);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "", // Initial empty name, to be replaced with actual data
    address: "", // Initial empty address, to be replaced with actual data
    rating: null, // Initial null rating, to be replaced with actual data
  });
  const [menuList, setMenuList] = useState([]);
  const [addedItem, setAddedItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }

    const { menu, restName } = location.state;

    if (menu && menu.length > 0) {
      setMenuList(menu);

      // Set initial restaurant info if provided
      setRestaurantInfo((prevInfo) => ({
        ...prevInfo,
        name: restName || prevInfo.name,
      }));

      // Fetch restaurant address and update restaurantInfo
      const restaurantId = menu[0].restaurantId;
      axios.get(`/restaurant/${restaurantId}/address`)
        .then((response) => {
          const { address } = response.data;
          setRestaurantInfo((prevInfo) => ({
            ...prevInfo,
            address, // Update address with actual data
          }));
        }).catch((err) => {
          console.error('Error fetching restaurant address:', err);
        });
    }
  }, [user, location.state]);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('token');
      axios.post('/users/get-count', { userId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        setAddedItem(response.data.cartItem);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [userId]);

  const addItemToCart = (menu, number) => {
    const token = localStorage.getItem('token');
    axios.post(`/users/menu/${menu.restaurantId}`, { menu, number, userId }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((response) => {
      const resultItem = response.data.result;
      setAddedItem((prevItems) => {
        const findIndex = prevItems.findIndex((item) => item.itemId === resultItem.itemId);
        if (findIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[findIndex].quantity = resultItem.quantity;
          return updatedItems;
        } else {
          return [...prevItems, resultItem];
        }
      });
      window.location.reload();
    }).catch((err) => {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error adding item to cart:', err);
      }
    });
  };

  // Handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter menu items based on the search query
  const filteredMenu = menuList.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery) ||
    item.category.toLowerCase().includes(searchQuery)
  );

  // Group the filtered menu items by category
  const groupedFilteredMenu = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className='menu-container'>
      <div className="restaurant-info">
        <h2>{restaurantInfo.name}</h2>
        <p>{restaurantInfo.address}</p>
        {restaurantInfo.rating && <p>Rating: {restaurantInfo.rating} / 5</p>}
      </div>
      
      <div className="search-container">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search for dishes or categories..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {Object.keys(groupedFilteredMenu).map((category) => (
        <div key={category} className="menu-category">
          <h3>{category}</h3>
          <div className="menu-items">
            {groupedFilteredMenu[category].map((menu) => {
              const getCartItem = addedItem.find(item => item.itemId === menu._id) || { quantity: 0 };

              return (
                <div className="menu-item" key={menu._id}>
                  <div className="menu-item-details">
                    <h4>{menu.itemName}</h4>
                    <p>Price: ₹{menu.price}</p>
                  </div>
                  <div className="menu-item-actions">
                    <img src={`https://hungryhub-backend-gn2s.onrender.com/hungryhub/uploads/${menu.imageName}`} alt={menu.itemName} />
                    <div className="add-buttons">
                      {getCartItem.quantity > 0 ? (
                        <>
                          <button onClick={() => addItemToCart(menu, -1)}>-</button>
                          <span>{getCartItem.quantity}</span>
                          <button onClick={() => addItemToCart(menu, 1)}>+</button>
                        </>
                      ) : (
                        <button onClick={() => addItemToCart(menu, 1)}>ADD</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
