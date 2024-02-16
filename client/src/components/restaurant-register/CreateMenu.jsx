import React from 'react'
import "./create-menu.css"
import axios from '../../axios';
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { addMenuSchema } from '../../validation/formValidation'
import { yupResolver } from '@hookform/resolvers/yup';


function CreateMenu() {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(addMenuSchema)
  })

  // const location = useLocation();
  // const restaurantId = location.state.id;

  const submitMenu = async (data) => {
    let restToken = localStorage.getItem('restaurant-token')
    console.log(data);

    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("menu", data.menu[0]);
    // formData.append("restaurantId", restaurantId);
    console.log(formData);

    try {
      const response = await axios.post('/restaurant-addMenu', formData, {
        headers: {
          "Content-Type": 'multipart/form-data',
          'Authorization':`Bearer ${restToken}`
        }
      })
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container'>
      <div className="create-menu">
        <h1>Add Menu</h1>
        <form action="/restaurant-addMenu" id='form-menu' onSubmit={handleSubmit(submitMenu)} >
          <label htmlFor="">Item Name</label>
          <input type="text" id="" {...register('itemName', { required: true })} />
          <p>{errors.itemName && 'This field is required'}</p>
          <label htmlFor="">Category</label>
          <input type="text" id="" {...register('category', { required: true })} />
          <p>{errors.catrgory && 'This field is required'}</p>
          <label htmlFor="">Price</label>
          <input type="text" id="" {...register('price', { required: true })} />
          <p>{errors.price && 'This field is required'}</p>
          <label htmlFor="">Image</label>
          <input type="file"  {...register('menu', { required: true })}
            id="" />
          <p>{errors.menu && 'This field is required'}</p>

          <div className="buttons">
            <input type="submit" value="Submit" />
            <Link to={'/restaurant-control-center'} >Finish</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMenu
