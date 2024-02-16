import React, { useEffect, useState } from 'react'
import './menu.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../axios'
import { UserLoginContext } from '../context/useContext'
import { useContext } from 'react'

function MenuList() {
  const { user } = useContext(UserLoginContext)
  const [userId, setUserId] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    console.log(user);
    if (user !== null) {
      setUserId(user._id);
    }
  }, [userId]);

  const menu = location.state.menu
  const [menuList, setMenuList] = useState(menu)
  const [addedItem, SetAddedItem] = useState([])
  const [count, setCount] = useState(true)
  const addItemToCart = (menu, number) => {
    const token = localStorage.getItem('token')
    console.log(token);
    axios.post(`/users/menu/${menu.restaurantId}`, { menu, number, userId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      let resultItem = response.data.result
      SetAddedItem((prevItems) => {
        const findIndex = prevItems.findIndex((item) => item.itemId === resultItem.itemId);
        if (findIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[findIndex].quantity = resultItem.quantity;
          return updatedItems;
        } else {
          return [...prevItems, resultItem];
        }

      })
    }).catch((err) => {
      if (err.response.status == 401) {
        navigate('/login')
      }
    })
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token);
    axios.post('/users/get-count', { userId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      let cartItem = response.data.cartItem
      console.log(cartItem);
      SetAddedItem(cartItem)

    }).catch((err) => {
      // console.log(err);
      // console.log(addedItem);
    })

  }, [userId])
  return (
    <div className='container' id='menu-list'>
      <div className="restaurant-data">
        <h2>Irani Restaurant</h2>
        <h4>Chinese, North Indian</h4>
      </div>
      {menuList.map((menu) => {
        console.log(addedItem);
        let getCartItem
        if (addedItem) {
          getCartItem = addedItem.find(item => item.itemId === menu._id) || 0
          console.log(getCartItem);
         
        }

        return (
          <div className="menu-data" key={menu._id}>
            <div className='menu-item'>
              <h3>{menu.itemName}</h3>
              <h5>{menu.price}</h5>
            </div>
            <div className="menu-image">
              <img src={`http://localhost:9000/${menu.imageName}`} alt="" />
              <div className="add-buttons">
                {getCartItem && getCartItem.quantity > 0 ? (

                  <>
                    <button id='minus' onClick={() => addItemToCart(menu, -1)} className='click-minus'><i className="fa-solid fa-minus"></i></button>
                    <span>{getCartItem && getCartItem.quantity}</span>
                    <button id="add" onClick={() => addItemToCart(menu, 1)} className='click-add'><i className="fa-solid fa-plus"></i></button>
                  </>
                ) : (

                  <button className="click-add" onClick={() => addItemToCart(menu, 1)}>ADD</button>

                )}

              </div>
            </div>
          </div>
        );
      })}

    </div>
  )
}

export default MenuList
