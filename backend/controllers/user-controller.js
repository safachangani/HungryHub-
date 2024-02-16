const db = require('../config/connection')
const collections = require('../config/collections')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
require('dotenv').config();
const Razorpay = require('razorpay')
const crypto = require('crypto');
const { log } = require('console');

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
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
    },
    addToCart: (cartItems) => {
        console.log(cartItems.userId, "check ");
        return new Promise(async (resolve, reject) => {
            if (cartItems.userId) {
                const cart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: cartItems.userId })
                console.log(cart, 'i am cart broooooooh');
                const restaurant = await db.get().collection(collections.CART_COLLECTION).findOne({ restaurantId: cartItems.restaurantId })
                if (cart) {
                    let itemExist = cart.cartItem.findIndex(item => item.itemId.equals(cartItems.cartItem[0].itemId))
                    console.log(itemExist);
                    if (itemExist != -1) {
                        if (cart.cartItem[itemExist].quantity == 1 && cartItems.cartItem[0].quantity == -1) {
                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId, 'cartItem.itemId': cartItems.cartItem[0].itemId }, {
                                $pull: { cartItem: { itemId: cartItems.cartItem[0].itemId } }
                            }).then((response) => {
                                resolve(response)
                            })
                        }
                        else {

                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId, 'cartItem.itemId': cartItems.cartItem[0].itemId }, {
                                $inc: { 'cartItem.$.quantity': cartItems.cartItem[0].quantity }
                            }).then((response) => {
                                console.log(response, "82");
                                resolve(response)
                            })
                        }
                    }
                    else {
                        if (restaurant) {
                            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: cartItems.userId },
                                {
                                    $push: { cartItem: cartItems.cartItem[0] }
                                }).then((response) => {
                                    resolve(response)
                                })
                        }
                        else {
                            reject({ messaage: 'restaurant should be same' })
                        }
                    }
                }
                else {
                    db.get().collection(collections.CART_COLLECTION).insertOne(cartItems).then((response) => {
                        resolve(response)
                    })
                }
            }
            else {
                reject({ messaage: "please Login" })
            }
        })
    },
    updateCount: (userId, itemId, count) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: new ObjectId(userId), 'cartItem.itemId': new ObjectId(itemId) }, {
                $inc: { 'cartItem.$.quantity': count }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getQuantity: (userId, itemId) => {
        console.log(userId,'userid');
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
                console.log(response[0], "double");
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
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION).updateOne({ userId: new ObjectId(userId), 'cartItem.itemId': new ObjectId(itemId) }, {
                $pull: { cartItem: { itemId: new ObjectId(itemId) } }
            }).then((response) => {
                console.log(response, "checking");
                resolve()
            })
        })
    },
    getTotalCount: (userId) => {
        let user = new ObjectId(userId)
        console.log('check  userId', user);
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
                console.log(response, 'got id');
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
        console.log(userId,paymentMethod,totalPrice,'g');
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
                console.log(response)
                resolve(response.insertedId)
            })
        })
    },
    updateUserAddress: (address, userId) => {
        console.log(userId);
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
            console.log(orderIdString);
            var options = {
                amount: totalPrice * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderIdString
            };
            instance.orders.create(options, function (err, order) {
                console.log(order);
                db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: orderId }, {
                    $set: {
                        razorpayId: order.id
                    }
                }).then(() => {
                    console.log(order.id);
                    resolve(order)
                })
            });
        })
    },
    verifyRazorPayment: (details) => {
        console.log(details.response.razorpay_payment_id, 'sssssssssssss');
        return new Promise((resolve, reject) => {
            const data = details.order.id + "|" + details.response.razorpay_payment_id;
            const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
            hmac.update(data);
            const generated_signature = hmac.digest('hex');
            if (generated_signature == details.response.razorpay_signature) {
                console.log('payment is successful');
                resolve({ status: 'placed' })
            }
        })
    },
    updateOrderStatus: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ userId: new ObjectId(userId) }, {
                $set: { 'status': 'placed' }
            }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    }
}

