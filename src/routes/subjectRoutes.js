const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const {
  validateCreateSubject,
  validateUpdateSubject,
  validateSubjectName
} = require("../validations/subjectValidator");
const validateRequest = require("../middlewares/validateRequest");
const authenticate = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/checkRole");

router.post("/", validateCreateSubject, validateRequest, authenticate,checkRole(['admin']),subjectController.createSubject);
router.get("/", subjectController.getAllSubjects);
router.put("/:name", validateUpdateSubject, validateRequest, authenticate,checkRole(['admin']),subjectController.updateSubjectByName);
router.delete("/:name", validateSubjectName, validateRequest, authenticate,checkRole(['admin']),subjectController.deleteSubjectByName);

module.exports = router;