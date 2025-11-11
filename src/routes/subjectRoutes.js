const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const {
  validateCreateSubject,
  validateUpdateSubject,
  validateSubjectName
} = require("../validations/subjectValidator");
const validateRequest = require("../middlewares/validateRequest");

router.post("/", validateCreateSubject, validateRequest, subjectController.createSubject);
router.get("/", subjectController.getAllSubjects);
router.put("/:name", validateUpdateSubject, validateRequest, subjectController.updateSubjectByName);
router.delete("/:name", validateSubjectName, validateRequest, subjectController.deleteSubjectByName);

module.exports = router;