require('dotenv').config();
const chai = require("chai");
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/models/userSchema");
const Subject = require("../src/models/subjectSchema");
const CompletedExam = require("../src/models/completedExamsSchema");
const credentials = require("../src/models/credentialSchema");

const expect = chai.expect;

describe("Analytics API", () => {
  let userId;
  let subjectId;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/OnlineExamPortal_test');
    }
    
    // Clean up
    await User.deleteMany({});
    await Subject.deleteMany({});
    await CompletedExam.deleteMany({});
    await credentials.deleteMany({});

    // Create test credential
    const credential = await credentials.create({
      email: "test@example.com",
      password: "hashedpassword"
    });

    // Create test user
    const user = await User.create({
      firstname: "Test",
      lastname: "User",
      role: "student",
      credentialId: credential._id
    });
    userId = user._id;

    // Create test subject
    const subject = await Subject.create({
      subjectName: "Mathematics",
      description: "Test subject",
      isActive: true
    });
    subjectId = subject._id;

    // Create test completed exams
    await CompletedExam.create({
      userId: userId,
      examName: "Mathematics",
      difficulty: "basic",
      answeredQuestions: [],
      score: 85,
      attemptedQuestions: 10
    });

    await CompletedExam.create({
      userId: userId,
      examName: "Mathematics",
      difficulty: "intermediate",
      answeredQuestions: [],
      score: 45,
      attemptedQuestions: 10
    });
  });

  it("should get overall stats for a user", async () => {
    const res = await request(app)
      .get(`/api/analytics/student/overall/${userId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("totalExams", 2);
    expect(res.body).to.have.property("avgScore", 65);
    expect(res.body).to.have.property("passingRate", 100);
  });

  it("should get progress for a user", async () => {
    const res = await request(app)
      .get(`/api/analytics/student/progress/${userId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("progress");
    expect(res.body.progress).to.be.a("number");
  });

  it("should get difficulty analytics for a user", async () => {
    const res = await request(app)
      .get(`/api/analytics/student/difficulty/${userId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0]).to.have.property("examName", "Mathematics");
    expect(res.body[0]).to.have.property("difficulty");
    expect(res.body[0]).to.have.property("score");
  });

  it("should get leaderboard", async () => {
    const res = await request(app)
      .get("/api/analytics/student/leaderboard");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0]).to.have.property("name", "Test User");
    expect(res.body[0]).to.have.property("avgScore", 65);
    expect(res.body[0]).to.have.property("totalExams", 2);
  });

  it("should get admin stats", async () => {
    const res = await request(app)
      .get("/api/analytics/admin/stats");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("totalStudents", 1);
    expect(res.body).to.have.property("totalExams", 3);
    expect(res.body).to.have.property("passRate", 100);
  });

  it("should get student performance", async () => {
    const res = await request(app)
      .get("/api/analytics/admin/students");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0]).to.have.property("name", "Test User");
    expect(res.body[0]).to.have.property("avgScore", 65);
    expect(res.body[0]).to.have.property("attempts", 2);
    expect(res.body[0]).to.have.property("passRate", 100);
  });

  it("should get subject performance", async () => {
    const res = await request(app)
      .get("/api/analytics/admin/subjects");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0]).to.have.property("subjectName", "Mathematics");
    expect(res.body[0]).to.have.property("avgScore", 65);
    expect(res.body[0]).to.have.property("attempts", 2);
  });
});