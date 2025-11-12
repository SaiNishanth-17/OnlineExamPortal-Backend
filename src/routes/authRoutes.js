const express = require('express');
const router = express.Router();
const { login, signup, protected } = require('../controllers/userController');
const { getUserByID, updateOwnProfile, updateStudentRole, deleteStudentById, getAllUsers } = require('../controllers/dataManageController');
const { signupValidation, loginValidation } = require('../validations/authValidator');
const { validateUpdateProfile, validateUpdateRole, validateDeleteUser } = require('../validations/dataManageValidator');
const { validationResult } = require('express-validator');
const authenticate  = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/checkRole');
const validateRequest = require('../middlewares/validateRequest');
 
router.post('/signup', signupValidation,  (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signup(req, res, next);
});
 
router.post('/login', loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  login(req, res, next);
});
 
 
router.get('/allUsers', authenticate,checkRole(['admin']), getAllUsers);
 
router.get('/students/:id', getUserByID);
 
router.put('/profile', authenticate, checkRole(['admin','student']), validateUpdateProfile, validateRequest, updateOwnProfile);
 
router.put('/student/role/:id', authenticate, checkRole(['admin']), validateUpdateRole, validateRequest, updateStudentRole);
 
router.delete('/student/:id', authenticate, checkRole(['admin']), validateDeleteUser, validateRequest, deleteStudentById);
 
 
module.exports = router;
 
 