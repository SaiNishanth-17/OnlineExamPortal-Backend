const Question = require("../models/questionSchema");
const Subject = require("../models/subjectSchema");

exports.createQuestion = async (req, res) => {
  try {
    const { subject, difficulty } = req.params;
    const { qName, options, correctAnswer } = req.body;

    const subjectDoc = await Subject.findOne({ subjectName: subject });
    if (!subjectDoc) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const currentCount = subjectDoc.questionsByDifficulty[difficulty]?.length || 0;
    if (currentCount >= 10) {
      return res.status(400).json({ error: `Maximum 10 ${difficulty} questions allowed for this subject` });
    }

    const filter = {subject: subjectDoc._id, difficulty: difficulty, qName: qName };

    const update = {
      $set: { options: options,correctAnswer: correctAnswer},
      $setOnInsert: { subject: subjectDoc._id, difficulty: difficulty}};

    const question = await Question.findOneAndUpdate( filter, update,
      { new: true, upsert: true, runValidators: true  });

    await Subject.updateOne( { _id: subjectDoc._id},
      { $addToSet: { [`questionsByDifficulty.${difficulty}`]: question._id } }
    );

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuestionsBySubjectAndDifficulty = async (req, res) => {
  try {
    const { subject, difficulty } = req.params;

    const subjectDoc = await Subject.findOne({subjectName:subject}).populate(`questionsByDifficulty.${difficulty}`);
    if (!subjectDoc) return res.status(404).json({ error: "Subject not found" });

    res.json(subjectDoc.questionsByDifficulty[difficulty]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id: questionId, subject, difficulty } = req.params;
    const subjectDoc = await Subject.findOne({ subjectName: subject });

    if (!subjectDoc) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    await Subject.findOneAndUpdate(
      { subjectName: subject },
      { $pull: { [`questionsByDifficulty.${difficulty}`]: questionId } }
    );
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 