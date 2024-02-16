const db = require('../config/connection')
const collections = require('../config/collections')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')
const { response } = require('express')
module.exports = {
    addRestaurant: (restaurantDetails) => {
        return new Promise(async (resolve, reject) => {
            let restaurant = await db.get().collection(collections.RESTAURANT_REGISTER).findOne({ EmailAddress: restaurantDetails.EmailAddress })
            console.log(restaurant, "here");
            if (restaurant) {
                reject({ status: false })
            }
            else {
                bcrypt.hash(restaurantDetails.Password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        restaurantDetails.Password = hash;
                        db.get().collection(collections.RESTAURANT_REGISTER).insertOne(restaurantDetails).then((response) => {

                            resolve(response)
                        })
                    }
                })
            }

        })
    },
    getRestaurant: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.RESTAURANT_REGISTER).find().toArray().then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    addMenuDetails: (menuDetails) => {
        console.log(menuDetails);
        return new Promise(async (resolve, reject) => {

            db.get().collection(collections.MENU_DETAILS).insertOne(menuDetails).then((response) => {
                resolve()
            })
        })
    },
    getMenuImage: (restaurantIds) => {
        console.log(restaurantIds);
        const restId = restaurantIds.map(restId => new ObjectId(restId))
        console.log(restId);
        return new Promise(async (resolve, reject) => {
            let MenuList = await db.get().collection(collections.MENU_DETAILS).find({ restaurantId: { $in: restaurantIds } }).toArray()
            console.log(MenuList, 'meenow');
            resolve(MenuList)


        })
    },
    restaurantSignUp: (signupData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.RESTAURANT_OWNERS).findOne({ EmailAddress: signupData.EmailAddress })
            if (user) {
                reject({ status: false })
            } else {
                bcrypt.hash(signupData.Password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        signupData.Password = hash
                        db.get().collection(collections.RESTAURANT_OWNERS).insertOne(signupData).then((response) => {
                            resolve({ status: true })
                        })
                    }
                })
            }
        })
    },
    restaurantLogin: (loginDetails) => {
        return new Promise(async (resolve, reject) => {
            let restaurant = await db.get().collection(collections.RESTAURANT_REGISTER).findOne({ EmailAddress: loginDetails.Email })
            if (restaurant) {
                bcrypt.compare(loginDetails.Password, restaurant.Password, (err, result) => {
                    if (err) {
                        reject()
                    }
                    else if (result) {
                        resolve({ message: 'login successful', restaurant })
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
    getOrder: (restaurantId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).find({ restaurantId: new ObjectId(restaurantId) }).toArray().then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    aggregateOrderMenu: (order) => {
        console.log(order.orderItems);
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: collections.MENU_DETAILS,
                        localField: 'orderItems.itemId',
                        foreignField: '_id',
                        as: 'menuItems'
                    }
                },
                {
                    $unwind: '$menuItems'
                }, {
                    $addFields: {
                        'menuItems.quantity': '$orderItems.quantity', // Add the quantity field to menuItems
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        useId: { $first: '$userId' },
                        restaurantId: { $first: '$restaurantId' },
                        name: { $first: "$Name" },
                        address: { $first: "$address" },
                        paymentMethod: { $first: "$paymentMethod" },
                        totalPrice: { $first: "$totalPrice" },
                        date: { $first: "$date" },
                        status: { $first: "$status" },
                        menuItems: { $push: "$menuItems" },

                    }
                }              
            ]).toArray().then((response) => {
                resolve(response)
                console.log(response, 'worked robert');
            })
        })
    },
    getMenu: (resId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.MENU_DETAILS).find({ restaurantId: resId }).toArray().then((response) => {
                console.log(response, 'hi');
                resolve(response)
            })
        })
    },
    getProfile:(resId)=>{
        return new Promise(async(resolve,reject)=>{
         let restaurantProfile = await db.get().collection(collections.RESTAURANT_REGISTER).findOne({_id:new ObjectId(resId)})
            resolve(restaurantProfile);
        })
    }


}