import React, { useState } from 'react';
import './App.css';
import Home from './pages/user/Home'
import Register from './pages/admin/RestaurantRegister'
import RestaurantAddMenu from './pages/admin/RestaurantAddMenu';
import Menu from './pages/user/Menu'
import UserSignUP from './pages/user/UserSignUP';
import UserLogin from './pages/user/UserLogin';
import AddToCart from './pages/user/AddToCart';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import { UserLoginContext } from './components/context/useContext';
import { UserProvider } from './components/context/useContext';
import RestaurantControlPanel from './pages/admin/RestaurantControlPanel';
import RestaurantAccountCreation from './pages/admin/RestaurantAccountCreation';
import RestaurantAccountLogin from './pages/admin/RestaurantAccountLogin';
function App() {
    // const [loggedIn,setLoggedIn] = useState(null)
  return (
    <div className="App">
    
          
      <Router>
        
          <UserProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<UserSignUP />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/menu/:restId' element={<Menu />} />
          <Route path='/add-to-cart' element={<AddToCart/>}/>   
          <Route path='/restaurant-signup' element={<RestaurantAccountCreation/>}/>
          <Route path='/restaurant-login' element={<RestaurantAccountLogin/>}/>
          <Route path='/restaurant-register' element={<Register />} />
          <Route path='/restaurant-addMenu' element={<RestaurantAddMenu />} />
          <Route path='/restaurant-control-center' element={<RestaurantControlPanel/>}/>
        </Routes>
          </UserProvider>
      </Router>
         
        
    </div>
  );
}

export default App;
