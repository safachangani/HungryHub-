import React, { useEffect, useState } from 'react'
import './restaurants.css'
import axios from '../../axios'
import { useNavigate,useLocation } from 'react-router-dom'
function Restaurants() {
  const navigate = useNavigate();
  const location = useLocation()

  const userId ='6471f9cc40dcddd0fed9dfd1'
  const userName = 'safa c'
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => {
    
    axios.get('/users')
      .then(response => {
        let restaurantsArray = response.data.restaurantData
        setRestaurants(restaurantsArray)
        // console.log(restaurantsArray); 
        
        const sortedRestaurantsList = [...restaurantsArray].sort((a, b) => b.relevance - a.relevance);
        setRestaurants(sortedRestaurantsList);
      }).catch((err) => {
        console.log(err);
      })


  }, []);

  const viewHandle = (restId, menu) => {
    
    navigate(`/menu/${restId}`, { state: { menu,userId ,userName} })
    

  }
 
  const filterRestaurants = (sortOption) => {
    let sortedRestaurantsList = [];
    switch (sortOption) {
      case 'Relevance':
        sortedRestaurantsList = [...restaurants].sort((a, b) => b.relevance - a.relevance);
        break;
      case 'Delivery Time':
        sortedRestaurantsList = [...restaurants].sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'Rating':
        sortedRestaurantsList = [...restaurants].sort((a, b) => b.rating - a.rating);
        break;
      case 'Cost: Low To High':
        sortedRestaurantsList = [...restaurants].sort((a, b) => a.cost - b.cost);
        break;
      case 'Cost: High To Low':
        sortedRestaurantsList = [...restaurants].sort((a, b) => b.cost - a.cost);
        break;
      default:
        sortedRestaurantsList = [...restaurants].sort((a, b) => b.relevance - a.relevance);
        break;
    }
    setRestaurants(sortedRestaurantsList)
  }


  return (
    <div className='container'>
      <div className='filters'>
        <h1>373 restaurants</h1>
        <div className='filter-options'>
          <ul className='filter-options'>
            <li><button onClick={(e) => {
              const filterValue = e.target.textContent
              filterRestaurants(filterValue)
            }}>Relevance</button></li>
            <li> <button onClick={(e) => {
              const filterValue = e.target.textContent
              filterRestaurants(filterValue)
            }}>Delivery Time</button></li>
            <li><button onClick={(e) => {
              const filterValue = e.target.textContent
              filterRestaurants(filterValue)
            }}>Rating</button></li>
            <li><button onClick={(e) => {
              const filterValue = e.target.textContent
              filterRestaurants(filterValue)
            }}>Cost: Low To High</button></li>
            <li><button onClick={(e) => {
              const filterValue = e.target.textContent
              filterRestaurants(filterValue)
            }}>Cost: High To Low</button></li>

          </ul>
          <button id='filter-icon'><span>Filters</span> <i className="fa-solid fa-sliders fa-rotate-90"></i></button>
        </div>
      </div>
      <div className='restaurants'>
        {restaurants.map((restaurant => {
          console.log(restaurant.menus)
    
          return (
            <div className="restaurant-details" key={restaurant._id}>

              <img src={`http://localhost:9000/${restaurant.menus[0].imageName}`}

                 alt="" /> 
              <h3>{restaurant.RestaurantName}</h3>
              <p>{restaurant.CuisineType}</p>
              <div className='restaurant-review'>
                <div id='rate'>
                  <i className="fa-solid fa-star"></i>
                  <span>{restaurant.rating}</span>
                </div>
                <span>{restaurant.deliveryTime} minutes</span>
                <span id='currency'><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M564 936 290 652v-66h130q57 0 100-37t50-103H240v-60h325q-13-48-53.5-79T420 276H240v-60h480v60H566q23 20 39 51t23 59h92v60h-90q-8 91-67.5 145.5T420 646h-52l279 290h-83Z" /></svg>{restaurant.cost} fOR TWO</span>
              </div>
              <button type='button' onClick={() => viewHandle(restaurant._id, restaurant.menus)}>QUICK VIEW</button>
            </div>
          )
        }))}



      </div>
    </div>
  )
}

export default Restaurants
