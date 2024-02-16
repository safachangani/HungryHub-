import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { useLocation  ,useNavigate} from 'react-router-dom'
import jwt_decode from 'jwt-decode';
import axios from '../../axios';
import { UserLoginContext } from '../context/useContext'
import { useContext } from 'react'
function NavBar() {
  const navigate =useNavigate()
  const {user,setUser}= useContext(UserLoginContext)
  const [userName,setUserName] = useState('Account')
  let userId
  
    const [changeBackgroundColor, setChangeBackGroundColor] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const handleMouseEnter = () => {
        setChangeBackGroundColor(true)
    }

    const handleMouseLeave = () => {
        setChangeBackGroundColor(false)
    }
    
    const countStyle = {
        backgroundColor: changeBackgroundColor ? '#fc8019' : '#68a720'
    }
    useEffect(() => {
        const token =localStorage.getItem('token')
        if (token) {
            const decodedToken= jwt_decode(token)
            console.log(decodedToken);
            setUser(decodedToken)
            setUserName(decodedToken.FullName)
             userId = decodedToken._id
        }
        axios.post('/users/get-total-count', { userId },{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }).then((response) => {
            console.log(response,'hi');
            setTotalCount(response.data.response.totalCount)
        }).catch((err)=>{
            console.log(err.response.status);
            if (err.response.status) {
                setTotalCount(0)
            }
        })
    },[])

    return (
        <div className='navbar'>
            <div className='nav location'>
                <a href="/">Icon</a>
                <Link to="/">Location</Link>
            </div>


            <ul className="main-nav nav">
                <li>

                    <Link to="/" className='search icon'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>Search</span>
                    </Link>
                </li>
                <li>

                    <Link to="/" className='search icon'>
                        <i className="fa-solid fa-percent"></i>

                        <span>Offers</span>
                    </Link>
                </li>
                <li>

                    <Link to="/" className='search icon'>
                        <i className="fa-regular fa-life-ring"></i>
                        <span>Help</span>
                    </Link>
                </li>
                <li className="dropdown">
                    <Link to="/" className='search icon'>
                        <i className="fa-regular fa-user"></i>
                        <span>{userName}</span>
                    </Link>
                    <ul className="drop-nav">
                        <li><Link to="#">Profile</Link></li>
                        <li><Link to="#">Orders</Link></li>
                        <li><Link to="/login">{userName === 'Account' ? 'Login' : 'Logout'}</Link></li>
                    </ul>
                </li>

                <Link to={{pathname: `/add-to-cart`, state:{userName}}} className='search icon' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z">
                        </path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    {totalCount !== 0 && <span className="count" style={countStyle}>{totalCount}</span>}
                    <span>Cart</span>
                </Link>
            </ul>
        </div>

    )
}

export default NavBar
