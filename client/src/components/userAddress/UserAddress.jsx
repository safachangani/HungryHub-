import React, { useEffect, useState } from 'react';
import './user-address.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userAddressSchema } from '../../validation/formValidation';
import axios from '../../axios';
import Payment from '../../components/payment/Payment';

function UserAddress(props) {
  console.log(props.cart);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userAddressSchema)
  });

  useEffect(() => {
    // Fetch user data to get saved address
    const token = localStorage.getItem('token');
    axios.get('/users/user-address', {
      headers: {
        Authorization: `Bearer ${token}`, // If required
      },
    })
    .then((res) => {
      console.log(res.data, "User address fetched successfully");
      setUserAddress(res.data.address);
      reset(res.data.address); // Set form default values
    })
    .catch((error) => {
      console.error("Error fetching user address:", error.message);
    });
  }, [reset]);

  const handleButtonClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addressSubmit = (address) => {
    console.log(address);
    const token = localStorage.getItem('token');
    setIsLoading(true); // Start loading
    axios.post('/users/update-address', { address }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log(response.data.userAddress);
      setTimeout(() => {
        setIsLoading(false); // Stop loading
        handleButtonClick(); // Close sidebar
      }, 3000);
      setUserAddress(response.data.userAddress);
    }).catch((error) => {
      console.error("Error updating address:", error.message);
      setIsLoading(false); // Stop loading
    });
  };

  return (
    <div className='order-create'>
      {props.cart === true &&
        (
          <div className='user-address'>
            <h3>Add delivery address</h3>
            <span>You seem to be in a new location</span>
            <div className="address-box">
              <i className="fa-solid fa-location-dot"></i>
              <div className='address'>
                <h4>Add New Address</h4>
                {userAddress ? (
                  <>
                    <span>{userAddress.StreetAddress}, {userAddress.City}, {userAddress.State}, {userAddress.Pincode}</span>
                    <button id='deliver' onClick={handleButtonClick}>DELIVER HERE</button>
                  </>
                ) : (
                  <button onClick={handleButtonClick}>ADD NEW</button>
                )}
              </div>
            </div>
          </div>
        )}
      <div>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className='close-sidebar'>
            <button onClick={handleButtonClick}><i className="fa-solid fa-xmark fa-2x"></i></button>
            <h3>Save delivery address</h3>
          </div>
          <div className='user-address-div'>
            <nav className='address-nav'>
              <form onSubmit={handleSubmit(addressSubmit)}>
                <div className='address-div'>
                  <label htmlFor="">Name</label>
                  <input type="text" name='Name' {...register('Name', { required: true })} />
                  <p className='error'>{errors.Name?.message}</p>
                </div>
                <div className='address-div'>
                  <label htmlFor="">Street Address</label>
                  <input type="text" name='StreetAddress' {...register('StreetAddress', { required: true })} />
                  <p className='error'>{errors.StreetAddress?.message}</p>
                </div>
                <div className='address-div'>
                  <label htmlFor="">City</label>
                  <input type="text" name='City' {...register('City', { required: true })} />
                  <p className='error'>{errors.City?.message}</p>
                </div>
                <div className='address-div-row'>
                  <div>
                    <label htmlFor="">State</label>
                    <input type="text" name='State' {...register('State', { required: true })} />
                    <p className='error'>{errors.State?.message}</p>
                  </div>
                  <div>
                    <label htmlFor="">Pincode</label>
                    <input type="text" name='Pincode' {...register('Pincode', { required: true })} />
                    <p className='error'>{errors.Pincode?.message}</p>
                  </div>
                </div>
                <div className='address-div'>
                  <label htmlFor="">Phone Number</label>
                  <input type="text" name='PhoneNumber' {...register('PhoneNumber', { required: true })} />
                  <p className='error'>{errors.PhoneNumber?.message}</p>
                </div>
                <div>
                  <span>Type of Address</span>
                  <div className='address-div-row' id='radio'>
                    <div className="button-radio">
                      <input type="radio" name="DeliveryType" value='home' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="home"><i className="fa-solid fa-house"></i> Home</label>
                    </div>
                    <div className="button-radio">
                      <input type="radio" name="DeliveryType" value='work' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="work"><i className="fa-solid fa-briefcase"></i> Work</label>
                    </div>
                    <div className="button-radio">
                      <input type="radio" name="DeliveryType" value='other' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="other"><i className="fa-solid fa-location-dot"></i> Other</label>
                    </div>
                  </div>
                  <p className='error'>{errors.DeliveryType?.message}</p>
                </div>
                <div>
                  <button type="submit"><span>SAVE ADDRESS & PROCEED</span></button>
                </div>
              </form>
            </nav>
          </div>
        </div>
        <div className={`overlay ${sidebarOpen ? 'open' : ''}`}></div>
        {isLoading && <div className="loading lds-dual-ring"></div>}
        {/* Render Payment component only if userAddress is not null */}
        {userAddress && <Payment totalPrice={props.totalPrice} />}
      </div>
    </div>
  );
}

export default UserAddress;
