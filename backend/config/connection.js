const { MongoClient } = require('mongodb');

const state = {
    db: null,
    client: null,
};

// Connection URL
const url = 'mongodb+srv://csafa8001:Mongo8001c@cluster0.8wxb2ny.mongodb.net/?tls=true';
const dbName = 'HungryHub';

module.exports.connect = async function () {
    try {
        // Use connect method to connect to the server
        state.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await state.client.connect();
        console.log('MongoDB connected successfully to server');
        state.db = state.client.db(dbName);
        return 'done.';
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        throw err; // Rethrow the error to handle it in the calling code
    }
};

module.exports.get = function () {
    return state.db;
};

module.exports.close = function () {
    if (state.client) {
        state.client.close();
        console.log('MongoDB connection closed');
    }
};
