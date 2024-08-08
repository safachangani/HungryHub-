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
    deleteMenu:(id)=>{
        return new Promise((resolve, reject) => {
            const objectId = new ObjectId(id)
            db.get().collection(collections.MENU_DETAILS).deleteOne({ _id: objectId }).then((result) => {
              if (result.deletedCount === 0) {
                reject(new Error('No document found with that ID.'));
              } else {
                resolve(result);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
    },
    updateMenu:(menuId,updatedData)=>{
        console.log(menuId);
        return new Promise((resolve,reject)=>{
            const objectId = new ObjectId(menuId)
            const updateFields = {
                ...(updatedData.itemName && { itemName: updatedData.itemName }),
                ...(updatedData.category && { category: updatedData.category }),
                ...(updatedData.price && { price: updatedData.price }),
                ...(updatedData.restaurantId && { restaurantId: updatedData.restaurantId }),
                // ...(updatedData.imageName && { imageName: updatedData.imageName }),
              }
            db.get()
            .collection(collections.MENU_DETAILS)
            .updateOne(
              { _id: objectId }, // Filter criteria
              { $set: updateFields } // The new data to update
            )
            .then(result => {
              if (result.modifiedCount === 0) {
                reject(new Error('No document found with that ID or no changes made.'));
              } else {
                resolve(result);
              }
            })
            .catch(error => {
              reject(error);
            });
        })
    },
   
    getProfile:(resId)=>{
        return new Promise(async(resolve,reject)=>{
         let restaurantProfile = await db.get().collection(collections.RESTAURANT_REGISTER).findOne({_id:new ObjectId(resId)})
            resolve(restaurantProfile);
        })
    },
    getRestaurantAddress: (resId) => {
        return new Promise(async (resolve, reject) => {
          try {
            // Fetch the restaurant document based on the provided ID
            let restaurantProfile = await db.get().collection(collections.RESTAURANT_REGISTER).findOne(
              { _id: new ObjectId(resId) },
              { projection: {RestaurantAddress: 1 } } // Fetch only the address field
            );
            console.log(restaurantProfile,"gduyeeeewui");
            if (restaurantProfile) {
              resolve(restaurantProfile.RestaurantAddress);
            } else {
              reject('Restaurant not found');
            }
          } catch (error) {
            console.error('Error fetching restaurant address:', error);
            reject('Error fetching restaurant address');
          }
        });
      },
    

}