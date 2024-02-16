import React, { useState } from 'react'
import './signup.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSignUpSchema } from '../../validation/formValidation'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'
function SignUp() {
  const [errorMessage,SetErrorMessage]=useState('')
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSignUpSchema)
  })
  const signUpSubmit = (data) => {
    delete data.ConfirmPassword;
    console.log(data);

    axios.post('/users/signup',data).then((response)=>{
        console.log(response);
        navigate('/login')

    }).catch((err)=>{
        console.log(err.response.data.message);
        SetErrorMessage(err.response.data.message)
    })

  }
  return (
    <div className="account">
      <div className='create-account'>
        <div className="food-image">
        </div>
        <div className="sign-up">
          <h1>HungryHub</h1>
          <h3>Create Account</h3>
          <h5>Please fill out the form below to create your account</h5>
          <form action="" onSubmit={handleSubmit(signUpSubmit)}>
            <div className='sign-up-form'>
              <label htmlFor="">Email</label>
              <input type="text" name="EmailAddress" {...register('EmailAddress', { required: true })} placeholder='safa@example.com' />
              <p>{errors.EmailAddress?.message}</p>
              {errorMessage && <p>{errorMessage}</p>}
            </div>

            <div className='sign-up-form'>
              <label htmlFor="">Full Name</label>
              <input type="text" name="FullName" {...register('FullName', { required: true })} placeholder='Safa C' />
              <p>{errors.FullName?.message}</p>
            </div>

            <div className='sign-up-form'>
              <label htmlFor="">Password</label>
              <input type="password" name="Password" {...register('Password', { required: true })} placeholder='At least 5 character' />
              <p>{errors.Password?.message}</p>

            </div>
            <div className='sign-up-form'>
              <label htmlFor="">Confirm Password</label>
              <input type="password" name="ConfirmPassword" {...register('ConfirmPassword', { required: true })} placeholder='At least 5 character' />
              <p>{errors.ConfirmPassword?.message}</p>

            </div>
            <input type="submit" id='sign-up-btn' value="Sign Up" />
            <span>do you have account?<a href="/login"> Login</a></span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
