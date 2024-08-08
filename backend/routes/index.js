var express = require('express');
var router = express.Router();
const multer = require('multer')
const upload = multer({ dest: './uploads/' })
var restaurantsCollecter = require('../controllers/restaurant-controller')
var fs = require('fs')
const jwt = require('jsonwebtoken');
require('dotenv').config()

/* GET home page. */
router.post('/restaurant-register', function (req, res, next) {
  restaurantsCollecter.addRestaurant(req.body).then((response) => {
    const id = response.insertedId
    res.status(200).json({ massage: 'restaurant added succesfully', id })
  })
    .catch((err) => {
      if (err) {
        res.status(400).json({ message: 'This email address is already registered. Please try logging in or use a different email address to sign up' })
      }
      else {
        res.status(500).json({ message: 'server error' })
      }
    })
});

router.post('/restaurant-addMenu',authenticationToken, upload.single("menu"), (req, res, next) => {
  try {
    console.log("hereh",req.user._id);
    const menuDetails = req.body
    menuDetails.restaurantId=req.user._id;
    const fileType = req.file.mimetype.split("/")[1]
    const newFileName = req.file.filename + "." + fileType 
    fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, () => {
      menuDetails.imageName = newFileName
      restaurantsCollecter.addMenuDetails(menuDetails).then(() => {
        res.status(200).json({ massage: 'menu added successfully' })
      }).catch(() => {
        res.status(500).json({ massage: 'server error' })
      })
    }) 
  } catch (error) {
    console.log(error);
  }
})

router.post('/restaurant-login', (req, res) => {
  restaurantsCollecter.restaurantLogin(req.body).then((response) => {
    console.log(response,"here now");
    if (response.restaurant) {
      const restaurant = response.restaurant
      const token = jwt.sign(restaurant, process.env.SECRET_KEY)
      res.status(200).json({ response, token })
    } else {
      res.status(200).json({ response })
    }
  }).catch((err) => {
    res.status(500).json({ message: "server error" })
  })
})
function authenticationToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if (token === 'null') return res.sendStatus(401)
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    console.log(decoded, 13);
    req.user = decoded
    next()
  })
}
router.get('/restaurant-orders',authenticationToken,(req,res)=>{
  restaurantsCollecter.getOrder(req.user._id).then((response)=>{
    console.log(response);
    restaurantsCollecter.aggregateOrderMenu(response).then((response)=>{
      res.status(200).json({ massage: 'got order successfully',response })
    }).catch(()=>{

      res.status(500).json({message:'server error'})
    })

  })
})
router.get('/restaurant-menu',authenticationToken,(req,res)=>{
restaurantsCollecter.getMenu(req.user._id).then((response)=>{
  console.log(response);
  res.status(200).json({ response })
}).catch(()=>{
  res.status(500).json({message:'server error'})
})
})
router.delete('/restaurant-menu/:id',authenticationToken,(req,res)=>{
  restaurantsCollecter.deleteMenu(req.params.id).then((response)=>{
    console.log(response);
    res.status(200).json({ message: 'Menu item successfully deleted' });
  })
  .catch((error) => {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'An error occurred while deleting the menu item', error: error.message });
  });
})
router.get('/restaurant-profile',authenticationToken,(req,res)=>{
  restaurantsCollecter.getProfile(req.user._id).then((profile)=>{
    console.log(profile);
    res.status(200).json({ profile })
  }).catch(()=>{
    res.status(500).json({message:'server error'})
  })
})
router.put('/restaurant-menu/:menuId',authenticationToken,(req,res)=>{
  const updatedData = req.body;
  // console.log("menuid",req.params.restId);
restaurantsCollecter.updateMenu(req.params.menuId,updatedData).then((response)=>{
  if (response.modifiedCount > 0) {
    // Successfully updated the item
    res.status(200).json({ message: 'Menu item successfully updated' });
  } else {
    // No document was modified
    res.status(404).json({ message: 'Menu item not found or no changes made' });
  }
})
.catch(error => {
  console.error('Error updating menu item:', error);
  res.status(500).json({ message: 'An error occurred while updating the menu item', error: error.message });
})
})


router.get('/restaurant/:restaurantId/address', async (req, res) => {
 
    const restaurantId = req.params.restaurantId;
   
  restaurantsCollecter.getRestaurantAddress(restaurantId)
  .then((address) => {
    // If the address is successfully retrieved, send it as a response
    console.log(address,"hgygweuy");
    res.status(200).json({ address });
  })
  .catch((err) => {
    // If an error occurs, send an error response
    console.error('Error fetching restaurant address:', err);
    res.status(500).json({ error: 'Failed to retrieve restaurant address' });
  });
});
module.exports = router;
