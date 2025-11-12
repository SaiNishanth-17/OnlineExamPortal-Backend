const express = require("express");
const router = express.Router();
const { submitExam } = require("../controllers/examSubmissionController");
const { validateExamSubmission } = require("../validations/examSubmissionValidator");
const validateRequest = require("../middlewares/validateRequest");
const authenticate = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/checkRole");

router.post("/:examName/submitExam", (req, res, next) => {
  req.body.examName = req.params.examName;
  next();
}, validateExamSubmission, validateRequest,authenticate,checkRole(['student']), submitExam);

module.exports = router;