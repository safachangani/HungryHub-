import React, { useState } from 'react'
import './register.css'
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../validation/formValidation'
import { yupResolver } from '@hookform/resolvers/yup'


function Register() {

   const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(registerSchema)
   })
   const [errorMessage,SetErrorMessage]=useState('')

   const navigate = useNavigate()

   const submitRegister = async (data) => {
    delete data.ConfirmPassword;
      
     
      axios.post('/restaurant-register',data).then((response)=>{
         console.log(response);
         navigate('/restaurant-login')
      }).catch ((error)=> {
         console.log(error);
        SetErrorMessage(error.response.data.message)

      })

   }
   return (
      <div className='conatiner'>
         <div className='row'>
            <div className='img'>
               <h1>Partner with Us</h1>
               <span>Get listed on India's leading online food delivery marketplace today</span>
            </div>

            <div className='registration-form'>
               <form action="" onSubmit={handleSubmit(submitRegister)}>
                  <div className="form">
                  <div className="row1">
                  <h3>Restaurant Information</h3>
                  <div className='info'>
                     <label htmlFor="">Restaurant Name</label>
                     <input type="text" {...register('RestaurantName', { required: true })} />
                     <p>{errors.RestaurantName && 'This field is required'}</p>
                  </div>
                  <div className='info'>
                     <label htmlFor="">Restaurant Address</label>
                     <input type="text" {...register('RestaurantAddress', { required: true })} />
                     <p>{errors.RestaurantAddress && 'This field is required'}</p>
                  </div>
                  <div className='info'>
                     <label htmlFor="">Owner Number</label>
                     <input type="text" {...register('OwnerNumber', { required: true })} />
                     <p>{errors.OwnerNumber && 'Mobile number is required '}</p>
                  </div>
                  <div className='info'>
                     <label htmlFor="">Cuisine Type</label>
                     <input type="text" {...register('CuisineType', { required: true })} />
                     <p>{errors.CuisineType && 'This field is required'}</p>
                  </div>
                  </div>
                  <div className="row2">
                     <h3>Account Information</h3>
                     <div className='info'>
                     <label htmlFor="">Email</label>
                     <input type="email" {...register('EmailAddress', { required: true })} />
                     <p>{errors.Email && 'This field is required'}</p>
                     {errorMessage && <p>{errorMessage}</p>}
                  </div>
                  <div className='info'>
                     <label htmlFor="">Password</label>
                     <input type="password" {...register('Password', { required: true })} />
                     <p>{errors.Password && 'This field is required'}</p>
                  </div>
                  <div className='info'>
                     <label htmlFor="">Confirm Password</label>
                     <input type="password" {...register('ConfirmPassword', { required: true })} />
                     <p>{errors.ConfirmPassword && 'This field is required'}</p>
                  </div>
                  </div>
                  </div>
                  
                  <input type="submit" value="Add Restaurent" />
               </form>
            </div>
         </div>
      </div>
   )
}

export default Register
