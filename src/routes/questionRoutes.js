const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const {
  validateCreateQuestion,
  validateUpdateQuestion,
} = require("../validations/questionValidator");
const validateRequest = require("../middlewares/validateRequest");

router
  .route("/:subject/:difficulty")
  .post(validateCreateQuestion, validateRequest, questionController.createQuestion)
  .get(questionController.getQuestionsBySubjectAndDifficulty);

router
  .route("/:subject/:difficulty/:id")
  .put(validateUpdateQuestion, validateRequest, questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;