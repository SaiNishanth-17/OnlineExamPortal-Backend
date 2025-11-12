const { body, param } = require('express-validator');

exports.validateUpdateProfile = [
  body('firstname')
    .notEmpty().withMessage('Firstname is required')
    .isLength({ min: 3, max: 50 }).withMessage('Firstname must be between 3-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Firstname must contain only letters and spaces'),

  body('lastname')
    .notEmpty().withMessage('Lastname is required')
    .isLength({ min: 3, max: 50 }).withMessage('Lastname must be between 3-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Lastname must contain only letters and spaces')
];

exports.validateUpdateRole = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'student']).withMessage('Role must be either admin or student')
];

exports.validateDeleteUser = [
  param('id')
    .isMongoId().withMessage('Invalid user ID')
];