const Subject = require("../models/subjectSchema");

exports.createSubject = async (req, res) => {
  try {
    console.log("Incoming subject:", req.body);
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error("Create error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("questionsByDifficulty.basic")
      .populate("questionsByDifficulty.intermediate")
      .populate("questionsByDifficulty.advanced");

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubjectByName = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { subjectName: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};

exports.deleteSubjectByName = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ subjectName: req.params.name });
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};