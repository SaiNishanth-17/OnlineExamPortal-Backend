const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/userController');
const { getUserByID, updateOwnProfile, updateStudentRole, deleteStudentById, getAllUsers } = require('../controllers/dataManageController');
const { signupValidation, loginValidation } = require('../validations/authValidator');
const { validationResult } = require('express-validator');
const authenticate = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/checkRole');

router.post('/signup', signupValidation, (req, res, next) => {
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

router.get('/allUsers', authenticate, checkRole(['admin']), getAllUsers);
router.get('/students/:id', getUserByID);

router.put('/profile', authenticate, checkRole(['admin','student']), updateOwnProfile);

router.put('/student/role/:id', authenticate, checkRole(['admin']), updateStudentRole);

router.delete('/student/:id', authenticate, checkRole(['admin']), deleteStudentById);

module.exports = router;