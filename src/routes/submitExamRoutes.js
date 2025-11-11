const express = require("express");
const router = express.Router();
const { submitExam } = require("../controllers/examSubmissionController");
const { validateExamSubmission } = require("../validations/examSubmissionValidator");
const validateRequest = require("../middlewares/validateRequest");

router.post("/:examName/submitExam", (req, res, next) => {
  req.body.examName = req.params.examName;
  next();
}, validateExamSubmission, validateRequest, submitExam);

module.exports = router;