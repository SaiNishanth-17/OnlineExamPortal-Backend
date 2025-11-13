const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const {
  validateCreateQuestion,
  validateUpdateQuestion,
} = require("../validations/questionValidator");
const validateRequest = require("../middlewares/validateRequest");
const authenticate = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/checkRole");

router
  .route("/:subject/:difficulty")
  .post(validateCreateQuestion, validateRequest,authenticate,checkRole(['admin']), questionController.createQuestion)
  .get(authenticate, questionController.getQuestionsBySubjectAndDifficulty);

router
  .route("/:subject/:difficulty/:id")
  .put(validateUpdateQuestion, validateRequest,authenticate,checkRole(['admin']), questionController.updateQuestion)
  .delete(authenticate,checkRole(['admin']),questionController.deleteQuestion);

module.exports = router;