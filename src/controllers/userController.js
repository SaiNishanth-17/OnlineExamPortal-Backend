const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const credentials = require('../models/credentialSchema');
require('dotenv').config();

exports.signup = async (req, res, next) => {
  try {
    const { firstname, lastname, role, email, password, confirmPassword } = req.body;

    const existingCredential = await credentials.findOne({ email });
    if (existingCredential) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCredential = await credentials.create({
      email,
      password: hashedPassword
    });

    const newUser = await User.create({
      firstname,
      lastname,
      role,
      credentialId: newCredential._id
    });

    const userResponse = newUser.toObject();
    delete userResponse.credentialId.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const credential = await credentials.findOne({ email });
    if (!credential) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const user = await User.findOne({ credentialId: credential._id });
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    const payload = {
      id: user._id,
      email: credential.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user: payload });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};
 
 
