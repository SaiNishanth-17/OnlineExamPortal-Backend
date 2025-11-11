const mongoose = require('mongoose');
const credentials=require('./credentialSchema') 

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
    minlength: [3, 'Firstname must be at least 3 characters'],
    maxlength: [50, 'Firstname must be less than 50 characters'],
    validate: {
      validator: value => /^[a-zA-Z\s]+$/.test(value),
      message: 'Firstname must contain only letters and spaces'
    }
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
    minlength: [3, 'Lastname must be at least 3 characters'],
    maxlength: [50, 'Lastname must be less than 50 characters'],
    validate: {
      validator: value => /^[a-zA-Z\s]+$/.test(value),
      message: 'Lastname must contain only letters and spaces'
    }
  },
  
  role: {
    type: String,
    enum: ['admin','student'],
    default: 'student'
  },
  credentialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'credentials'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Users', userSchema);
