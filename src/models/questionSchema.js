const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["basic", "intermediate", "advanced"],
    required: true,
  },
  qName: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [(arr) => arr.length === 4, "Exactly 4 options required"],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Question", questionSchema);
