const db = require('../config/connection')
const collections = require('../config/collections')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
require('dotenv').config();
const Razorpay = require('razorpay')
const crypto = require('crypto');
const { log } = require('console');

var instance = new Razorpay({
    key_id:'rzp_test_rgK41u4XoUpxl8',
    key_secret: '9vPKQ8U7tCD2NfDtxbsVO2oS',
});

module.exports = {
    userSignUp: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({ EmailAddress: userDetails.EmailAddress })
            if (user) {
                reject({ status: false })
            } else {
                bcrypt.hash(userDetails.Password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        userDetails.Password = hash
                        db.get().collection(collections.USERS).insertOne(userDetails).then((response) => {
                            resolve({ status: true })
                        })
                    }
                })
            }
        })
    },
    userLogin: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({ EmailAddress: userDetails.Email })
            if (user) {
                bcrypt.compare(userDetails.Password, user.Password, (err, result) => {
                    if (err) {
                        reject()
                    }
                    else if (result) {
                        resolve({ message: 'login successful', user })
                    }
                    else {

                        resolve({ message: 'Incorrect Password' })
                    }
                })
            } else {
                resolve({ message: 'Invalid Email Address' })
            }
        })
    },addToCart: (cartItems) => {
        return new Promise(async (resolve, reject) => {
            if (cartItems.userId) {
                const cart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: cartItems.userId });
                const restaurant = await db.get().collection(collections.CART_COLLECTION).findOne({ restaurantId: cartItems.restaurantId });
    
                if (cart) {
                    let itemExist = cart.cartItem.findIndex(item => item.itemId.equals(cartItems.cartItem[0].itemId));
    
                    if (itemExist != -1) {
                        if (cart.cartItem[itemExist].quantity == 1 && cartItems.cartItem[0].quantity == -1) {
                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId, 'cartItem.itemId': cartItems.cartItem[0].itemId }, {
                                $pull: { cartItem: { itemId: cartItems.cartItem[0].itemId } }
                            }).then(async (response) => {
                                // Check if the cart is empty after removal
                                const updatedCart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: cartItems.userId });
                                if (updatedCart.cartItem.length === 0) {
                                    // Remove the entire cart document if empty
                                    await db.get().collection(collections.CART_COLLECTION).deleteOne({ userId: cartItems.userId });
                                }
                                resolve(response);
                            });
                        } else {
                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId, 'cartItem.itemId': cartItems.cartItem[0].itemId }, {
                                $inc: { 'cartItem.$.quantity': cartItems.cartItem[0].quantity }
                            }).then((response) => {
                                resolve(response);
                            });
                        }
                    } else {
                        if (restaurant) {
                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId }, {
                                $push: { cartItem: cartItems.cartItem[0] }
                            }).then((response) => {
                                resolve(response);
                            });
                        } else {
                            reject({ message: 'restaurant should be the same' });
                        }
                    }
                } else {
                    db.get().collection(collections.CART_COLLECTION).insertOne(cartItems).then((response) => {
                        resolve(response);
                    });
                }
            } else {
                reject({ message: "please Login" });
            }
        });
    },
    updateCount: (userId, itemId, count) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: new ObjectId(userId), 'cartItem.itemId': new ObjectId(itemId) }, {
                $inc: { 'cartItem.$.quantity': count }
            }).then((response) => {
                resolve(response);
            });
        });
    },
    
    getQuantity: (userId, itemId) => {
       
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { userId: new ObjectId(userId) }
                },
                {
                    $unwind: '$cartItem'
                },
                {
                    $match: { 'cartItem.itemId': new ObjectId(itemId) }
                },
                {
                    $group: {
                        _id: null,
                        itemId: { $first: '$cartItem.itemId' },
                        quantity: { $first: '$cartItem.quantity' },
                        total: { $first: { $multiply: ['$cartItem.price', '$cartItem.quantity'] } },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        itemId: 1,
                        quantity: 1,
                        total: 1,
                        totalPrice: 1
                    }
                }
            ]).toArray().then((response) => {
               
                resolve(response[0])
            })

        })
    },
    getTotalPrice: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { userId: new ObjectId(userId) }
                },
                {
                    $unwind: '$cartItem'
                },
                {
                    $group: {
                        _id: 0,
                        totalPrice: { $sum: { $multiply: ['$cartItem.price', '$cartItem.quantity'] } },
                    }
                }, {
                    $project: {
                        _id: 0,
                        totalPrice: 1
                    }
                }
            ]).toArray().then((response) => {
                console.log(response);
                resolve(response[0])
            })
        })
    },
    getCartItems: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $unwind: '$cartItem',
                },
                {
                    $match: {
                        userId: new ObjectId(userId)
                    },
                },
                {
                    $lookup: {
                        from: collections.MENU_DETAILS,
                        localField: 'cartItem.itemId',
                        foreignField: '_id',
                        as: 'cart'
                    }
                },
                {
                    $unwind: '$cart'
                },
                {
                    $group: {
                        _id: '$userId',
                        items: {
                            $push: {
                                itemId: '$cartItem.itemId',
                                imageName: '$cart.imageName',
                                itemName: '$cart.itemName',
                                category: '$cart.category',
                                quantity: '$cartItem.quantity',
                                total: { $multiply: ['$cartItem.price', '$cartItem.quantity'] }
                            }
                        },
                        totalPrice: { $sum: { $multiply: ['$cartItem.price', '$cartItem.quantity'] } },
                    }
                }, {
                    $project: {
                        _id: 1,
                        items: 1,
                        totalPrice: 1
                    }
                }
            ]).toArray().then((response) => {
                console.log(response);
                resolve(response[0])
            }).catch((err) => {
                reject(err)
            })

        })
    },
    removeItem: (userId, itemId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Remove the item from the cart
                await db.get().collection(collections.CART_COLLECTION).updateOne(
                    { userId: new ObjectId(userId), 'cartItem.itemId': new ObjectId(itemId) },
                    { $pull: { cartItem: { itemId: new ObjectId(itemId) } } }
                );
    
                // Check if the cart is empty after removal
                const updatedCart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: new ObjectId(userId) });
                if (updatedCart.cartItem.length === 0) {
                    // Remove the entire cart document if empty
                    await db.get().collection(collections.CART_COLLECTION).deleteOne({ userId: new ObjectId(userId) });
                }
    
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    
    getTotalCount: (userId) => {
        let user = new ObjectId(userId)
       
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)
                    }
                },
                {
                    $unwind: '$cartItem'
                },
                {
                    $group: {
                        _id: 1,
                        totalCount: { $sum: '$cartItem.quantity' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalCount: 1
                    }
                }
            ]).toArray().then((response) => {
                
                resolve(response[0])
            })
        })
    },
    getItemCount: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).findOne({ userId: new ObjectId(userId) }).then((response) => {
                console.log(response);
                if (response !== null) {
                    resolve(response.cartItem)
                }
            })
        })
    },
    getOrderDetails: (userId, paymentMethod, totalPrice) => {
      
        return new Promise((resolve, reject) => {
            let status = paymentMethod == 'cod' ? 'placed' : 'pending'
            db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { userId: new ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: collections.USERS,
                        localField: "userId",
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $group: {
                        _id: 0,
                        userId: { $first: '$userId' },
                        restaurantId: { $first: '$restaurantId' },
                        orderItems: { $first: '$cartItem' },
                        Name: { $first: '$userDetails.FullName' },
                        address: { $first: '$userDetails.Address' },
                        paymentMethod: { $first: paymentMethod },
                        totalPrice: { $first: totalPrice },
                        date: { $first: new Date() },
                        status: { $first: status }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: 1,
                        restaurantId: 1,
                        orderItems: 1,
                        Name: 1,
                        address: 1,
                        paymentMethod: 1,
                        totalPrice: 1,
                        date: 1,
                        status: 1
                    }
                }
            ]).toArray().then((response) => {
                resolve(response[0])
            })
        })
    },
    createOrder: (userId, orderData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderData).then((response) => {
                resolve(response.insertedId)
            })
        })
    },
    updateUserAddress: (address, userId) => {
        
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USERS).updateOne({ _id: new ObjectId(userId) }, {
                $set: { "Address": address }
            }).then((response) => {
                resolve()
            })
        })
    },
    generateRazorpay: (orderId, totalPrice) => {
        return new Promise((resolve, reject) => {

            let orderIdString = orderId.toString();
    
            var options = {
                amount: totalPrice * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderIdString
            };
            instance.orders.create(options, function (err, order) {
                if (err || !order) {
                    console.error("Error creating Razorpay order:", err);
                    reject(err || new Error("Failed to create order"));
                    return;
                }
                
                db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: orderId }, {
                    $set: {
                        razorpayId: order.id
                    }
                }).then(() => {
                  
                    resolve(order);
                }).catch(dbErr => {
                    console.error("Error updating database:", dbErr);
                    reject(dbErr);
                });
            });
            
        })
    },
    verifyRazorPayment: (details) => {
       
        return new Promise((resolve, reject) => {
            const data = details.order.id + "|" + details.response.razorpay_payment_id;
            const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
            hmac.update(data);
            const generated_signature = hmac.digest('hex');
            if (generated_signature == details.response.razorpay_signature) {
                
                resolve({ status: 'placed' })
            }
        })
    },
    updateOrderStatus: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ userId: new ObjectId(userId) }, {
                $set: { 'status': 'placed' }
            }).then((response) => {
                
                resolve(response)
            })
        })
    },
    getAddress:(userId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USERS).findOne({ _id: new ObjectId(userId) })
              .then((user) => {
                if (user) {
                    
                  resolve(user.Address); // Assuming 'address' is a field in the user document
                } else {
                  reject('User not found');
                }
              })
              .catch((error) => {
                reject(error);
              });
          });
    },
    clearCart : (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).deleteOne(
                { userId: new ObjectId(userId) }
            ).then((result) => {
               
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    
    },
    getOrderData:(orderId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).findOne(
              { _id: new ObjectId(orderId) }
            ).then((order) => {
              if (!order) {
                return reject(new Error('Order not found'));
              }
              console.log(order);
              resolve(order);
            }).catch((err) => {
              reject(err);
            })
        });
    },
     orderHistory : (userId) => {
         return new Promise((resolve, reject) => {
             db.get().collection(collections.ORDER_COLLECTION).find({ userId: new ObjectId(userId) }).toArray()
             .then((orders) => {
                    // console.log(orders,"found");
                    
                    resolve(orders);
                }).catch((err) => {
                    reject(err);
                });
        })
     },
     getMenuItems: (itemIds) => {
        return new Promise((resolve, reject) => {
          db.get().collection(collections.MENU_DETAILS).find({ _id: { $in: itemIds.map(id => new ObjectId(id)) } }).toArray()
            .then((result) => {
              resolve(result);
              console.log(result,"found");
            }).catch((err) => {
              reject(err);
            });
        });
      },
      getRestaurantNames: (restaurantIds) => {
        console.log(restaurantIds, "234");
        return new Promise((resolve, reject) => {
          // Ensure IDs are correctly formatted as ObjectId
          const objectIds = restaurantIds.map(id => new ObjectId(id));
          console.log("Formatted Object IDs:", objectIds);
    
          db.get().collection(collections.RESTAURANT_REGISTER)
            .find({ _id: { $in: objectIds } })
            .toArray()
            .then((restaurants) => {
              console.log("res", restaurants);
              resolve(restaurants);
            })
            .catch((err) => {
              console.error("Error during DB query:", err);
              reject(err);
            });
        });
      },
    
}
