import React, { useState } from 'react'
import './user-address.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { userAddressSchema } from '../../validation/formValidation'
import axios from '../../axios'
import Payment from '../../components/payment/Payment'

function UserAddress(props) {
  console.log(props.cart);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress,setUserAddress] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userAddressSchema)
  })

  const handleButtonClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addressSubmit = (address) => {
    console.log(address);
    const token= localStorage.getItem('token')
    axios.post('/users/update-address',{address},{
      headers:{
        Authorization:`Bearer ${token}`
      } 
    }).then((response)=>{
        console.log(response.data.userAddress);
        setTimeout(()=>{
          handleButtonClick()
          setIsLoading(!isLoading)
          
        },2000)
        setUserAddress(response.data.userAddress)
    }).catch(()=>{
      
    })
  }
  return (
    <div className='oreder-create'>

      {props.cart == true ?
        (
          <div className='user-address'>
            <h3>Add delivery address</h3>

            <span>You seem to be in the new location</span>
            <div className="address-box">
              <i className="fa-solid fa-location-dot"></i>
              <div className='address'>
                <h4>Add New Address</h4>
               {userAddress !== '' ?
                ( 
                  <>
                <span>{userAddress.StreetAddress},{ userAddress.City},{userAddress.State},{userAddress.Pincode}</span>
                <button id='deliver' >DELIVER HERE</button>
                  </>
             ):(
                <button onClick={handleButtonClick}>ADD NEW</button>

              )}
               
              </div>
            </div>

          </div>
        ) : ''}
      <div>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className='close-sidebar'>
            <button onClick={handleButtonClick}><i className="fa-solid fa-xmark fa-2x"></i></button>
            <h3>Save delivery address</h3>
          </div>
          <div className='user-address-div'>
            <nav className='address-nav'>
              <form action="" method="get" onSubmit={handleSubmit(addressSubmit)}>
                <div className='address-div'>

                  <label htmlFor="">Name</label>
                  <input type="text" name='Name' {...register('Name', { required: true })} />
                  <p className='error'>{errors.Name?.message}</p>

                </div>
                <div className='address-div'>
                  <label htmlFor="">Street Address</label>
                  <input type="text" name='StreetAddress' {...register('StreetAddress', { required: true })} />
                  <p className='error'>{errors.EStreetAddress?.message}</p>
                </div>

                <div className='address-div'>
                  <label htmlFor="">City</label>
                  <input type="text" name='City' {...register('City', { required: true })} />
                  <p className='error'>{errors.City?.message}</p>

                </div>
                <div className='address-div-row'>
                  <div >
                    <label htmlFor="">State</label>
                    <input type="text" name='State'{...register('State', { required: true })} />
                    <p className='error'>{errors.State?.message}</p>
                  </div >
                  <div >
                    <label htmlFor="">Pincode</label>
                    <input type="text" name='Pincode' {...register('Pincode', { required: true })} />
                    <p className='error'>{errors.Pincode?.message}</p>
                  </div>
                </div>
                <div className='address-div'>
                  <label htmlFor="">Phone Number</label>
                  <input type="mobile" name='PhoneNumber' {...register('PhoneNumber', { required: true })} />
                  <p className='error'>{errors.PhoneNumber?.message}</p>

                </div>
                <div>
                <span>Type of Address</span>
                  <div className='address-div-row' id='radio'>
                    <div className="button-radio">
                      <input type="radio" name="DeliveryType" value='home' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="home"><i className="fa-solid fa-house"></i> Home</label>
                    </div>
                    <div className="button-radio" id='work-other'>
                      <input type="radio" name="DeliveryType" value='work' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="work"><i className="fa-solid fa-briefcase"></i> Work</label>
                    </div>
                    <div className="button-radio" id='work-other'>
                      <input type="radio" name="DeliveryType" value='other' {...register('DeliveryType', { required: true })} />
                      <label htmlFor="other"><i className="fa-solid fa-location-dot"></i> Other</label>
                    </div>
                  </div>
                  <p className='error'>{errors.DeliveryType?.message}</p>
                </div>
                <div>
                <button  type="submit"><span>SAVE ADDRESS & PROCEED</span> </button>
                </div>
              </form>
            </nav>
          </div>
        </div>
        <div className={`overlay ${sidebarOpen ? 'open' : ''}`}></div>
      {isLoading &&  <div className="loading lds-dual-ring"></div> }
      <Payment totalPrice={props.totalPrice} />
      </div>
    </div>
  )
}

export default UserAddress
