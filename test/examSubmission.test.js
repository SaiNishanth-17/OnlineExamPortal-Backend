require('dotenv').config();
const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/models/userSchema");
const Subject = require("../src/models/subjectSchema");
const Question = require("../src/models/questionSchema");
const CompletedExam = require("../src/models/completedExamsSchema");
const credentials = require("../src/models/credentialSchema");

const expect = chai.expect;

describe("Exam Submission API", () => {
  let userId;
  let questionId;
  const examName = "Math";

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/OnlineExamPortal_test');
    }
    
    await CompletedExam.deleteMany({});
    await User.deleteMany({});
    await credentials.deleteMany({});

    const credential = await credentials.create({
      email: "test@test.com",
      password: "password123"
    });

    const user = await User.create({
      firstname: "Test",
      lastname: "User",
      credentialId: credential._id
    });
    userId = user._id;

    const subject = await Subject.create({
      subjectName: examName,
      description: "Test subject"
    });

    const question = await Question.create({
      subject: subject._id,
      difficulty: "basic",
      qName: "Test question",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A"
    });
    questionId = question._id;
  });

  it("should submit exam successfully", async () => {
    const res = await request(app)
      .post(`/api/exams/${examName}/submitExam`)
      .send({
        userId: userId,
        difficulty: "basic",
        answers: [{
          questionId: questionId,
          selectedOption: "A",
          correctOption: "A"
        }]
      });

    if (res.status !== 201) {
      console.log('Validation errors:', res.body);
    }
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Exam submitted successfully");
    expect(res.body.score).to.equal(100);
  });

  it("should prevent duplicate submission", async () => {
    const res = await request(app)
      .post(`/api/exams/${examName}/submitExam`)
      .send({
        userId: userId,
        difficulty: "basic",
        answers: [{
          questionId: questionId,
          selectedOption: "B",
          correctOption: "A"
        }]
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.include("already completed");
  });

  it("should fail without userId", async () => {
    const res = await request(app)
      .post(`/api/exams/${examName}/submitExam`)
      .send({
        difficulty: "intermediate",
        answers: [{
          questionId: questionId,
          selectedOption: "A",
          correctOption: "A"
        }]
      });

    expect(res.status).to.equal(422);
    expect(res.body.errors).to.be.an('array');
  });

  it("should fail with invalid difficulty", async () => {
    const res = await request(app)
      .post(`/api/exams/${examName}/submitExam`)
      .send({
        userId: userId,
        difficulty: "wrong",
        answers: [{
          questionId: questionId,
          selectedOption: "A",
          correctOption: "A"
        }]
      });

    expect(res.status).to.equal(422);
    expect(res.body.errors).to.be.an('array');
  });

  it("should fail with empty answers", async () => {
    const res = await request(app)
      .post(`/api/exams/${examName}/submitExam`)
      .send({
        userId: userId,
        difficulty: "intermediate",
        answers: []
      });

    expect(res.status).to.equal(422);
    expect(res.body.errors).to.be.an('array');
  });
});