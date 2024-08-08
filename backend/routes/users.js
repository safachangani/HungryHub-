var express = require('express');
var router = express.Router();
var restaurantsController = require('../controllers/restaurant-controller');
const userController = require('../controllers/user-controller');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const restaurantController = require('../controllers/restaurant-controller');
require('dotenv').config()


/* GET users listing. */
router.get('/', function (req, res, next) {
  restaurantsController.getRestaurant().then((restaurants) => {
    const restaurantIds = restaurants.map(rest => rest._id.toString())
    restaurantsController.getMenuImage(restaurantIds).then((response) => {
      const restaurantData = restaurants.map(res => {
        const menus = response.filter(menu => menu.restaurantId === res._id.toString())
        return {
          ...res,
          menus: menus
        }
      })
    
      res.status(200).json({ massage: 'restaurant added succesfully', restaurantData })
    })
  }).catch(() => {
    res.status(500).json({ massage: 'server error' })
  })
});

router.post('/signup', (req, res) => {
  userController.userSignUp(req.body).then((response) => {
    res.status(200).json({ massage: 'signed up successfully' })
  }).catch((err) => {
    if (err) {
      res.status(400).json({ message: 'This email address is already registered. Please try logging in or use a different email address to sign up' })
    }
    else {
      res.status(500).json({ message: 'server error' })
    }
  })
})

router.post('/login', (req, res) => {
  userController.userLogin(req.body).then((response) => {
 
    if (response.user) {
      const user = response.user
      const token = jwt.sign(user, process.env.SECRET_KEY)
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
    // console.log(decoded, 13);
    req.user = decoded
    next()
  })
}

router.post('/menu/:restId', authenticationToken, (req, res) => {
 
  // console.log('sa',req.user._id);
  const cartItems = {
    userId: new ObjectId(req.user._id),
    restaurantId: new ObjectId(req.body.menu.restaurantId),
    cartItem: [{
      price: parseFloat(req.body.menu.price),
      itemId: new ObjectId(req.body.menu._id),
      quantity: req.body.number
    }]
  }
  userController.addToCart(cartItems).then(async (response) => {
    let result = await userController.getQuantity(req.user._id, req.body.menu._id)
    if (result === undefined) {
      result = {
        itemId: req.body.menu._id,
        quantity: 0,
      }
    }
    res.status(200).json({ message: 'cart created', response, result })
  }).catch((err) => {
    res.status(500).json({ message: 'server error', err })
  })
})

router.get('/add-to-cart/', authenticationToken, async (req, res) => {
  // console.log(req.user._id);
  userController.getCartItems(req.user._id).then((response) => {
    res.status(200).json({ response })
  }).catch(() => {
    res.status(500).json({ message: 'server error' })
  })
})

router.post('/get-quantity', (req, res) => {
  console.log(req.body);
  const userId = req.body.userId
  const itemId = req.body.itemId
  const count = req.body.count
  userController.updateCount(userId, itemId, count).then((response) => {
    userController.getQuantity(userId, itemId).then(async (item) => {
      let totalPrice = await userController.getTotalPrice(userId)
      // console.log(totalPrice);
      // console.log(item.quantity);
      if (item.quantity === 0) {
        const removeditem = await userController.removeItem(req.body.userId, req.body.itemId)
      }
      res.status(200).json({ item, totalPrice })
    }).catch(() => {
      res.status(500).json({ message: 'server error' })
    })
  })
})

router.post('/remove-item', (req, res) => {
  userController.removeItem(req.body.userId, req.body.itemId).then(async () => {
    let totalPrice = await userController.getTotalPrice(req.body.userId);
    if (totalPrice == undefined) {
      totalPrice = { totalPrice: 0 };
    }
    res.status(200).json({ itemId: req.body.itemId, totalPrice });
  }).catch(() => {
    res.status(500).json({ message: 'server error' });
  });
});


router.post('/get-total-count', authenticationToken, (req, res) => {
  userController.getTotalCount(req.body.userId).then((response) => {
    // console.log(response, 'quantity');
    if (response == undefined) {
      return response = 0
    }
    res.status(200).json({ response })
  }).catch(() => {
    res.status(500).json({ message: 'server error' })
  })
})

router.post('/get-count', authenticationToken, (req, res) => {
  userController.getItemCount(req.body.userId).then((cartItem) => {
    res.status(200).json({ cartItem })
  }).catch(() => {
    res.status(500).json({ message: 'server error' })
  })
})

router.post('/update-address', authenticationToken, (req, res) => {
  // console.log(req.body.address, req.user._id);
  const userAddress = {
    StreetAddress: req.body.address.StreetAddress,
    City: req.body.address.City,
    State: req.body.address.State,
    Pincode: req.body.address.Pincode,
    DeliveryType: req.body.address.DeliveryType
  }
  userController.updateUserAddress(userAddress, req.user._id).then(() => {
    res.status(200).json({ userAddress })
  }).catch(() => {
    res.status(500).json({ message: 'server error' })
  })
})

router.post('/create-order', authenticationToken, (req, res) => {
  // console.log(req.body,'body');
  let paymentMethod = req.body.data.test
  // console.log(paymentMethod);
  userController.getOrderDetails(req.user._id, paymentMethod, req.body.totalPrice).then((response) => {
    // console.log(response,'re');
    let resId=response.restaurantId;
    // console.log(resId,"here is the restid");
    userController.createOrder(req.user._id, response).then(async (insertedId) => {
      // console.log(resId,'id');
      restaurantController.getOrder(resId).then((response)=>{
          // console.log(response,"i got the order");
      })
      console.log(insertedId);
      if (response.paymentMethod == 'razorpay') {
        console.log(true);
        razorpay = await userController.generateRazorpay(insertedId, response.totalPrice)
        res.status(200).json({ status: response.status,orderId: response._id, razorpay })
      }
      else {
        res.status(200).json({ status: response.status,orderId: response._id })
      }
    }).catch(() => {
      res.status(500).json({ message: 'server error' })
    })
  })
}),

router.get('/getrzpKeyId', (req, res) => {
  keyId = process.env.KEY_ID
  res.status(200).json({ keyId })
  })

router.post('/verifyRazorPayment', authenticationToken, (req, res) => {
  userController.verifyRazorPayment(req.body).then((response) => {
    console.log();
    userController.updateOrderStatus(req.user._id).then((response) => {
      // console.log(response);
      res.status(200).json({ status: 'placed' })
    }).catch(() => {
      res.status(500).json({ message: 'server error' })
    })
  })
}),


router.get('/user-address', authenticationToken, (req, res) => {
  const userId = req.user._id; // Move this line to the top
  userController.getAddress(userId).then((response) => {
    console.log("response.......",response);
    res.status(200).json({ address: response });
  }).catch((error) => {
    console.error("Error fetching user address:", error.message);
    res.status(500).json({ message: 'server error', error: error.message });
  });
});
router.post('/clear-cart', authenticationToken,(req, res) => {
  try {
      const userId = req.user._id; // Get the user ID from the request (authentication middleware)
      userController.clearCart(userId).then(()=>{
        res.status(200).json({ message: 'Cart cleared successfully' });

      })
  } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-order/:orderId',authenticationToken, (req, res) => {
  const orderId = req.params.orderId;
  console.log("Checking for order ID:", orderId);
  userController.getOrderData(orderId).then((orderData) => {
    res.status(200).json(orderData);
  }).catch((error) => {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  });
});

router.get('/location',authenticationToken,(req,res)=>{
  console.log("location check");
userController.getAddress(req.user._id).then((response)=>{
  console.log(response)
  res.status(200).json({location: response });
}).catch((error) => {
  console.error("Error fetching user address:", error.message);
  res.status(500).json({ message: 'server error', error: error.message });
})
})

router.get('/orders/history', authenticationToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await userController.orderHistory(userId);
    
    // Get unique itemIds and restaurantIds from all orders
    const itemIds = [];
    const restaurantIds = [];
    orders.forEach(order => {
      if (!restaurantIds.includes(order.restaurantId)) {
        restaurantIds.push(order.restaurantId);
      }
      order.orderItems.forEach(item => {
        if (!itemIds.includes(item.itemId)) {
          itemIds.push(item.itemId);
        }
      });
    });

    // Fetch menu data for all itemIds and restaurant data for all restaurantIds
    const [menuItems, restaurants] = await Promise.all([
      userController.getMenuItems(itemIds),
      userController.getRestaurantNames(restaurantIds)
    ]);

    // Combine menu and restaurant data with orders
    const ordersWithDetails = orders.map(order => {
      const restaurant = restaurants.find(rest => rest._id.toString() === order.restaurantId.toString());
      const updatedOrderItems = order.orderItems.map(item => {
        const menuItem = menuItems.find(menu => menu._id.toString() === item.itemId.toString());
        return {
          ...item,
          menuItem,
        };
      });
      return {
        ...order,
        restaurantName: restaurant ? restaurant.RestaurantName : 'Restaurant not found',
        orderItems: updatedOrderItems,
      };
    });

    res.status(200).json({ orders: ordersWithDetails });
  } catch (error) {
    console.error("Error fetching your past orders:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
