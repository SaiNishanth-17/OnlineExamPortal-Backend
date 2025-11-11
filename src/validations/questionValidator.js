const { body, param } = require("express-validator");
 
exports.validateCreateQuestion = [
  param("subject")
    .notEmpty()
    .withMessage("Subject name is required"),
 
  param("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["basic", "intermediate", "advanced"])
    .withMessage("Difficulty must be basic, intermediate, or advanced"),
 
  body("qName")
    .notEmpty()
    .withMessage("Question text is required")
    .isLength({ min: 3 })
    .withMessage("Question must be at least 3 characters"),
 
  body("options")
    .isArray({ min: 4, max: 4 })
    .withMessage("Options must be an array of exactly 4 items"),
 
  body("options.*")
    .notEmpty()
    .withMessage("Each option must be a non-empty string"),
 
  body("correctAnswer")
    .notEmpty()
    .withMessage("Correct answer is required")
    .custom((value, { req }) => {
      if (!req.body.options || !req.body.options.includes(value)) {
        throw new Error("Correct answer must match one of the options");
      }
      return true;
    }),
];
 
exports.validateUpdateQuestion = [
  param("id").isMongoId().withMessage("Invalid question ID"),
 
  param("subject")
    .optional()
    .notEmpty()
    .withMessage("Subject name must not be empty if provided"),
 
  param("difficulty")
    .optional()
    .isIn(["basic", "intermediate", "advanced"])
    .withMessage("Difficulty must be basic, intermediate, or advanced"),
 
  body("qName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Question must be at least 3 characters"),
 
  body("options")
    .optional()
    .isArray({ min: 4, max: 4 })
    .withMessage("Options must be an array of exactly 4 items"),
 
  body("options.*")
    .optional()
    .notEmpty()
    .withMessage("Each option must be a non-empty string"),
 
  body("correctAnswer")
    .optional()
    .custom((value, { req }) => {
      if (req.body.options && !req.body.options.includes(value)) {
        throw new Error("Correct answer must match one of the options");
      }
      return true;
    }),
];
 

 