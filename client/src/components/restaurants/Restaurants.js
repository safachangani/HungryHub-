import React, { useEffect, useState } from 'react';
import './restaurants.css';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('/users')
      .then(response => {
        const restaurantsArray = response.data.restaurantData;
        setRestaurants(restaurantsArray);
        setFilteredRestaurants(restaurantsArray); // Initially display all
      }).catch((err) => {
        console.log(err);
      })
  }, []);

  const filterRestaurants = (filterOption) => {
    setFilter(filterOption);
    let filtered = [...restaurants];

    switch (filterOption) {
      case 'Top Rated':
        filtered = filtered.filter(restaurant => restaurant.CuisineType === 'Japanese' || restaurant.CuisineType === 'Seafood' || restaurant.CuisineType === 'Indian');
        break;
      case 'Popular Cuisines':
        filtered = filtered.filter(restaurant => restaurant.CuisineType === 'Japanese' || restaurant.CuisineType === 'Italian');
        break;
      case 'Quick Service':
        // You can implement logic for quick service based on availability or set a default message
        break;
      case 'Affordable Options':
        filtered = filtered.filter(restaurant => restaurant.CuisineType === 'Indian' || restaurant.CuisineType === 'Mexican');
        break;
      default:
        // 'All' or any other default option
        break;
    }
    setFilteredRestaurants(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = restaurants.filter((restaurant) =>
      restaurant.RestaurantName.toLowerCase().includes(query) ||
      restaurant.CuisineType.toLowerCase().includes(query)
    );
  
    setFilteredRestaurants(filtered);
  };
  

  const viewHandle = (restId, restName, menu) => {
    console.log("rest name",restName);
    navigate(`/menu/${restId}`, { state: { menu,restName } });
  };
  

  return (
    <div className='container'>
      <div className="search-container">
    <i className="fa fa-search search-icon"></i>
    <input
      type="text"
      placeholder="Search for restaurants..."
      value={searchQuery}
      onChange={handleSearchChange}
      className="search-input"
    />
  </div>
      <div className='filters'>
        <h1>{filteredRestaurants.length} Restaurants</h1>
        <div className='filter-options'>
          <ul className='filter-options'>
            {['All', 'Top Rated', 'Popular Cuisines', 'Quick Service', 'Affordable Options'].map(option => (
              <li key={option}>
                <button onClick={() => filterRestaurants(option)}>{option}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='restaurants'>
        {filteredRestaurants.map((restaurant => (
          <div className="restaurant-details" key={restaurant._id}>
            <img src={`https://hungryhub-backend-gn2s.onrender.com/hungryhub/uploads/${restaurant.menus[0].imageName}`} alt="" />
            <h3>{restaurant.RestaurantName}</h3>
            <p>{restaurant.CuisineType}</p>
            <div className='restaurant-review'>
              <div id='rate'>
                <i className="fa-solid fa-star"></i>
                <span>{restaurant.rating}</span>
              </div>
              <span>{restaurant.deliveryTime || 'Quick'} minutes</span>
              {/* <span id='currency'><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M564 936 290 652v-66h130q57 0 100-37t50-103H240v-60h325q-13-48-53.5-79T420 276H240v-60h480v60H566q23 20 39 51t23 59h92v60h-90q-8 91-67.5 145.5T420 646h-52l279 290h-83Z" /></svg>{restaurant.cost} for two</span> */}
            </div>
            <button type='button' onClick={() => viewHandle(restaurant._id,restaurant.RestaurantName,restaurant.menus)}>QUICK VIEW</button>
          </div>
        )))}
      </div>
    </div>
  );
}

export default Restaurants;
