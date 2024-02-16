import React, { useEffect, useState } from 'react'
import './cart.css'
import axios from '../../axios'
import { Link, useParams } from 'react-router-dom'
import UserAddress from '../../components/userAddress/UserAddress'
import { UserLoginContext } from '../context/useContext'
import { useContext } from 'react'
function Cart() {

    const {user }= useContext(UserLoginContext)
  
    const [userId,setUserId] = useState(null)
  
    useEffect(() => {
        console.log(user);
        if (user !== null) {
          setUserId(user._id);
        }
      }, [user]);

    const [cartItems, setCartItems] = useState([])
    const [totalPrice,setTotalPrice] = useState(0)
    const [loggedIn,seTLoggedIn]= useState(true)

    useEffect(() => {

        if (user !== null) {
          setUserId(user._id);
        }
       
            
            const token = localStorage.getItem('token')
            console.log(user);
            axios.get(`/users/add-to-cart`,{
                headers:{
                'Authorization':`Bearer ${token}`
            }
        }).then((response) => {
            console.log(response.data.response);
            setTotalPrice(response.data.response.totalPrice)
            setCartItems(response.data.response.items)
            console.log(cartItems,totalPrice);
            console.log(response);
        
           
        }).catch((err) => {
            console.log(err,)
            if (err.response) {
                seTLoggedIn(false)
            }
            
        })
    console.log(user);
    }, [])
   
    const handleCount = (itemId, count) => {
        console.log('working');
        axios.post(`/users/get-quantity`, { userId, itemId, count },).then((response) => {
            let updatedItem = response.data.item
            setTotalPrice(response.data.totalPrice.totalPrice)
            // console.log(response);
            console.log(response.data.totalPrice.totalPrice);
            // console.log(updatedItem);
            setCartItems((prevCartItems) => {
                return (
                    prevCartItems.map((item) => {
                        if (item.itemId === updatedItem.itemId) {
                            if (updatedItem.quantity !== 0) {

                                return {
                                    ...item,
                                    quantity: updatedItem.quantity,
                                    total: updatedItem.total
                                }
                            } else {
                                return null
                            }

                        }
                        return item;
                    }).filter((item) => item != null)
                )
            })
            console.log(cartItems);

        }).catch((err) => {
            console.log('not workinggg');
            if (err.response.status==401) {
                seTLoggedIn(false)
            }
        })
    }
    const removeItem = (itemId) => {
        axios.post('/users/remove-item', { userId, itemId }).then((response) => {
            console.log(response);
            const removeItem = response.data.itemId
            setTotalPrice(response.data.totalPrice.totalPrice)
            setCartItems((prevCartItems) => {
                return (
                    prevCartItems.filter((item) => item.itemId !== removeItem)
                )
            })


        }).catch(() => {
            // console.log(err);
        })
    }
   

    return (
        
        <div className='delivery'>
            <UserAddress cart={loggedIn} totalPrice={totalPrice}/>
            
           {cartItems.length!==0 ? (
            <div className="cart">
                <div>
                <h3>IRANI RESTAURANT</h3>
                <h4>Calicut</h4>
                </div>
                {cartItems.map((item) => {
                    console.log(item.itemId);
                    return (
                        <div className="cart-element" key={item.itemId}>
                            <div className="food-description">

                                <div className="cart-element-image">
                                    <img src={`http://localhost:9000/${item.imageName}`} alt="" />
                                </div>
                                <div className="description">
                                    <h4>{item.itemName}</h4>
                                    <span><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M564 936 290 652v-66h130q57 0 100-37t50-103H240v-60h325q-13-48-53.5-79T420 276H240v-60h480v60H566q23 20 39 51t23 59h92v60h-90q-8 91-67.5 145.5T420 646h-52l279 290h-83Z" /></svg>{item.total}</span>
                                <div className='buttons'>
                                <div className="cart-add-buttons">
                                    <button className='minus button' onClick={() => handleCount(item.itemId, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="add button " onClick={() => handleCount(item.itemId, 1)}>+</button>
                                </div>
                                <div className="delete-cart"><button onClick={() => removeItem(item.itemId)}><i className="fa-solid fa-xmark"></i></button></div>
                              
                                </div>
                                    
                                </div>
                            </div>
                            </div>
                      
                    )
                })}
                <div className='check-out-total'>

                <div id='total'> <span >TO PAY</span> </div> <div className=' price-total'><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M564 936 290 652v-66h130q57 0 100-37t50-103H240v-60h325q-13-48-53.5-79T420 276H240v-60h480v60H566q23 20 39 51t23 59h92v60h-90q-8 91-67.5 145.5T420 646h-52l279 290h-83Z" /></svg> <span id='price'>{totalPrice}</span> </div>
                
                </div>
           </div>
           ):(
             <div className="empty-cart">
       <div className="empty-image"></div>
        <h3>Your cart is empty</h3>
        <p>You can go to home page to view more restaurants</p>
         <Link to={'/'} type='button' className='button'>SEE RESTAURANT NEAR YOU</Link>
       </div>

            )}
</div>
)}

export default Cart
