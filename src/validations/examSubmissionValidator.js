const { body } = require("express-validator");

exports.validateExamSubmission = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  body("examName")
    .notEmpty()
    .withMessage("Exam name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Exam name must be between 2 and 100 characters"),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["basic", "intermediate", "advanced"])
    .withMessage("Difficulty must be basic, intermediate, or advanced"),

  body("answers")
    .isArray({ min: 1 })
    .withMessage("Answers must be a non-empty array"),

  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required for each answer")
    .isMongoId()
    .withMessage("Invalid question ID format"),

  body("answers.*.selectedOption")
    .optional({ nullable: true, checkFalsy: false })
    .custom((value) => {
      if (value === null || value === undefined || typeof value === 'string') {
        return true;
      }
      throw new Error('Selected option must be a string or null');
    }),

  body("answers.*.correctOption")
    .notEmpty()
    .withMessage("Correct option is required for each answer")
    .isString()
    .withMessage("Correct option must be a string")
];