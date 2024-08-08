import React, { useState } from 'react';
import './register.css';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from '../../axios';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../validation/formValidation';
import { yupResolver } from '@hookform/resolvers/yup';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const submitRegister = async (data) => {
    delete data.ConfirmPassword;

    axios.post('/restaurant-register', data)
      .then((response) => {
        console.log(response);
        navigate('/restaurant-login');
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <div className='container' id='reg-container'>
      <div className='row'>
        <div className='img'>
          <h1>Partner with Us</h1>
          <span>Get listed on India's leading online food delivery marketplace today</span>
        </div>

        <div className='registration-form'>
          <form onSubmit={handleSubmit(submitRegister)}>
        <div className="login-link">
            <p>Already have an account? <Link to="/restaurant-login">Login here</Link></p>
          </div>
            <div className="form">
              <div className="row1">
                <h3>Restaurant Information</h3>
                <div className='info'>
                  <label>Restaurant Name</label>
                  <input type="text" {...register('RestaurantName')} />
                  <p>{errors.RestaurantName?.message}</p>
                </div>
                <div className='info'>
                  <label>Restaurant Address</label>
                  <input type="text" {...register('RestaurantAddress')} />
                  <p>{errors.RestaurantAddress?.message}</p>
                </div>
                <div className='info'>
                  <label>Owner Number</label>
                  <input type="text" {...register('OwnerNumber')} />
                  <p>{errors.OwnerNumber?.message}</p>
                </div>
                <div className='info'>
                  <label>Cuisine Type</label>
                  <input type="text" {...register('CuisineType')} />
                  <p>{errors.CuisineType?.message}</p>
                </div>
              </div>
              <div className="row2">
                <h3>Account Information</h3>
                <div className='info'>
                  <label>Email</label>
                  <input type="email" {...register('EmailAddress')} />
                  <p>{errors.EmailAddress?.message}</p>
                  {errorMessage && <p>{errorMessage}</p>}
                </div>
                <div className='info'>
                  <label>Password</label>
                  <input type="password" {...register('Password')} />
                  <p>{errors.Password?.message}</p>
                </div>
                <div className='info'>
                  <label>Confirm Password</label>
                  <input type="password" {...register('ConfirmPassword')} />
                  <p>{errors.ConfirmPassword?.message}</p>
                </div>
              </div>
            </div>

            <input type="submit" value="Add Restaurant" />
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default Register;
