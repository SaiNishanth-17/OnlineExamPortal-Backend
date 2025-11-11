const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/OnlineExamPortal';

mongoose.connect(mongoURL, {});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

module.exports = db;