import React, { useEffect, useState } from 'react'
// import jwt_decode from 'jsonwebtoken';
import '../signup/signup.css'
import './login.css'
import { userLoginSchema } from '../../validation/formValidation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate =useNavigate()
  
  const [errorMessage,SetErrorMessage] = useState('')
const {register,handleSubmit,formState:{errors}}=useForm({
    resolver:yupResolver(userLoginSchema)
})
const loginSubmit=(data)=>{
  console.log(data);
  axios.post('/users/login',data).then((response)=>{
    localStorage.setItem('token',response.data.token)
    SetErrorMessage(response.data.response.message)
    if(response.data.response.user){
      let userName=response.data.response.user.FullName
      let userId= response.data.response.user._id
      navigate('/',{state:{userName,userId}})
      // navigate('/add-to-cart/:userId',{state:{userName,userId}})
      console.log(userName);

    }
  }).catch((err)=>{
    console.log(err);
  })
}
// useEffect(()=>{
//   const token =localStorage.getItem('token')
//   console.log(token);
//   if (token) {
//     const decodedToken= jwt_decode(token)
//     console.log(decodedToken);
//   }
// })
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
             
              <span>New to HungryHub? <a href="/signup">Create Account</a> </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
