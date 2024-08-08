import React from 'react';
import './create-menu.css';
import axios from '../../axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addMenuSchema } from '../../validation/formValidation';
import { yupResolver } from '@hookform/resolvers/yup';

function CreateMenu() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(addMenuSchema),
  });

  const submitMenu = async (data) => {
    let restToken = localStorage.getItem('restaurant-token');

    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("menu", data.menu[0]);

    try {
      const response = await axios.post('/restaurant-addMenu', formData, {
        headers: {
          "Content-Type": 'multipart/form-data',
          'Authorization': `Bearer ${restToken}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <div className="create-menu">
        <h1>Add Menu</h1>
        <form id='form-menu' onSubmit={handleSubmit(submitMenu)}>
          <label>Item Name</label>
          <input type="text" {...register('itemName')} />
          <p>{errors.itemName?.message}</p>

          <label>Category</label>
          <input type="text" {...register('category')} />
          <p>{errors.category?.message}</p>

          <label>Price</label>
          <input type="text" {...register('price')} />
          <p>{errors.price?.message}</p>

          <label>Image</label>
          <input type="file" {...register('menu')} />
          <p>{errors.menu?.message}</p>

          <div className="buttons">
            <input type="submit" value="Submit" />
            <Link to={'/restaurant-control-center'}>Finish</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMenu;
