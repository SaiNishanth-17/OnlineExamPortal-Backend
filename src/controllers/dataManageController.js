const User = require('../models/userSchema');
const credentials = require('../models/credentialSchema');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('credentialId', 'email');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserByID = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId).populate('credentialId', 'email');
    if (!student) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};

exports.updateOwnProfile = async (req, res, next) => {
  try {
    const { firstname, lastname } = req.body;
    const userId = req.user.id; 

    if (!firstname || !lastname) {
      return res.status(400).json({ message: 'Firstname and lastname are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstname, lastname },
      { new: true, runValidators: true }
    ).populate('credentialId', 'email');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.updateStudentRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const requester = req.user;
    if (requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update student roles' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify other admin accounts' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).populate('credentialId', 'email');

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.deleteStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    if (requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const targetUser = await User.findById(id).populate('credentialId');
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete other admin accounts' });
    }

    await User.findByIdAndDelete(id);
    await credentials.findByIdAndDelete(targetUser.credentialId._id);

    res.status(200).json({ message: `User with ID ${id} deleted successfully` });
  } catch (err) {
    next(err);
  }
};