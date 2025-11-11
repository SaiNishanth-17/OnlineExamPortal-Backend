const mongoose = require("mongoose");
const CompletedExam = require("../models/completedExamsSchema");

exports.submitExam = async (req, res) => {
  try {
    const { userId, examName, difficulty, answers } = req.body;

    if (!userId || !examName || !difficulty || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    let attemptedQuestions = 0;
    let correctCount = 0;

    const answeredQuestions = answers.map((q) => {
      const isAttempted = q.selectedOption !== null && q.selectedOption !== undefined && q.selectedOption !== "";
      const isCorrect = isAttempted && q.selectedOption === q.correctOption;

      if (isAttempted) {
        attemptedQuestions++;
        if (isCorrect) correctCount++;
      }

      return {
        questionId: q.questionId,
        selectedOption: q.selectedOption || "",
        isCorrect,
      };
    });

    const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

    const completedExam = new CompletedExam({
      userId,
      examName,
      difficulty,
      answeredQuestions,
      score,
      attemptedQuestions,
    });

    await completedExam.save();

    res.status(201).json({
      message: "Exam submitted successfully",
      examName,
      score,
      correctCount,
      attemptedQuestions,
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ error: "Failed to submit exam" });
  }
};