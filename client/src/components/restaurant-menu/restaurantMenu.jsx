import React, { useEffect, useState } from 'react';
import './restaurant-menu.css';
import axios from '../../axios';
import { Link } from 'react-router-dom';
function RestaurantMenu() {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  useEffect(() => {
    const restaurantToken = localStorage.getItem('restaurant-token');
    axios.get('/restaurant-menu', {
      headers: {
        'Authorization': `Bearer ${restaurantToken}`,
      },
    })
      .then((response) => {
        console.log(response.data.response);
        setMenus(response.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    const restaurantToken = localStorage.getItem('restaurant-token');
    axios.delete(`/restaurant-menu/${id}`, {
      headers: {
        'Authorization': `Bearer ${restaurantToken}`,
      },
    })
      .then((response) => {
        setMenus(menus.filter(menu => menu._id !== id));
        
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEditClick = (menu) => {
    setSelectedMenu(menu);
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    const restaurantToken = localStorage.getItem('restaurant-token');
    axios.put(`/restaurant-menu/${selectedMenu._id}`, selectedMenu, {
      headers: {
        'Authorization': `Bearer ${restaurantToken}`,
      },
    })
      .then(response => {
        // Update the local state with the new data
        setMenus(menus.map(menu => 
          menu._id === selectedMenu._id ? selectedMenu : menu
        ));
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('Error updating menu item:', error);
      });
  };

  return (
    <div className="container">
      <div className='add-menu'>
      <h2>MENU LIST</h2>
      <Link to={'/restaurant-addMenu'} id='add-menu-btn'>Add Menu</Link>
      </div>
      <div className="menu-carts">
        {menus.map((menu) => (
          <div className="menu-cart" key={menu._id}>
            <img src={`http://localhost:9001/hungryhub/uploads/${menu.imageName}`} alt="" />
            <div className='item-details'>
              <span className="item-name">{menu.itemName}</span>
              <div className="item-cat-price">
                <span className="item-category">{menu.category}</span>
                <span className="item-price">Price {menu.price}</span>
              </div>
              <hr />
              <div className="buttons">
                <a href="#" className="button edit" id='edit-btn' onClick={() => handleEditClick(menu)}>Edit</a>
                <a href="#" className="button delete"id='delete-btn' onClick={() => handleDelete(menu._id)}>Delete</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Menu Item</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}>
              <label>
                Item Name:
                <input
                  type="text"
                  value={selectedMenu.itemName}
                  onChange={(e) => setSelectedMenu({ ...selectedMenu, itemName: e.target.value })}
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  value={selectedMenu.category}
                  onChange={(e) => setSelectedMenu({ ...selectedMenu, category: e.target.value })}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={selectedMenu.price}
                  onChange={(e) => setSelectedMenu({ ...selectedMenu, price: e.target.value })}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenu;