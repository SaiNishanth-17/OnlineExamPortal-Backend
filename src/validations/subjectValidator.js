const { body, param } = require("express-validator");

exports.validateCreateSubject = [
  body("subjectName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Subject name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean")
];

exports.validateUpdateSubject = [
  param("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Invalid subject name in URL"),
  body("subjectName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Subject name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters")
];

exports.validateSubjectName = [
  param("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Invalid subject name")
];