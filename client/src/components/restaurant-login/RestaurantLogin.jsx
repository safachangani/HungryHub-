import React, { useEffect, useState } from 'react'
// import jwt_decode from 'jsonwebtoken';
import '../signup/signup.css'
import '../login/login.css'
import { userLoginSchema } from '../../validation/formValidation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'

function RestaurantLogin() {
  const navigate =useNavigate()
  
  const [errorMessage,SetErrorMessage] = useState('')
const {register,handleSubmit,formState:{errors}}=useForm({
    resolver:yupResolver(userLoginSchema)
})
const loginSubmit=(data)=>{
  console.log(data,"here");
  axios.post('/restaurant-login',data).then((response)=>{
    console.log(response);
    localStorage.setItem('restaurant-token',response.data.token)
    SetErrorMessage(response.data.response.message)
    if(response.data.response.restaurant){
      navigate('/restaurant-addMenu',)
      // console.log(userName);
    }
  }).catch((err)=>{
    console.log(err);
  })
}
  return (
    <div>
      <div className="account">
        <div className='create-account'>

          <div className="food-image" id='food-image'>

          </div>
          <div className="sign-up">
            <h1>HungryHub</h1>
            <h3>Welcom Back</h3>
            <h5>Login with your Email and Password</h5>
            <form action="" onSubmit={handleSubmit(loginSubmit)}>
              <div className='sign-up-form'>
                <label htmlFor="">Email</label>
                <input type="text" name=""  {...register('Email',{required:true})} placeholder='Enter Your Email' />
                <p>{errors.Email?.message}</p>
                {errorMessage=='Invalid Email Address' && <p>{errorMessage}</p>}
              </div>

              <div className='sign-up-form'>
                <label htmlFor="">Password</label>
                <input type="password" name=""  {...register('Password',{required:true})} placeholder='Enter Your Password' />
                <p>{errors.Password?.message}</p>
                {errorMessage=='Incorrect Password' && <p>{errorMessage}</p>}

              </div>

              <a href="">forgot password</a>
              <input type="submit" value="Login"  />
             
              <span>New to HungryHub? <a href="/restaurant-signup">Create Account</a> </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantLogin
