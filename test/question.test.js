const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Subject = require("../src/models/subjectSchema");
const Question = require("../src/models/questionSchema");
 
chai.use(chaiHttp);
const expect = chai.expect;
 
describe("Question API", () => {
    const subjectName = "Science";
    let questionId;
 
    before(async () => {
        await Subject.deleteMany({});
        await Question.deleteMany({});
 
        const subject = new Subject({
            subjectName: subjectName,
            description: "Physics and Chemistry",
            questionsByDifficulty: { basic: [], intermediate: [], advanced: [] }
        });
        await subject.save();
    });
 
    it("should create a question (POST /api/questions/:subject/:difficulty)", async () => {
        const res = await chai.request(app)
            .post(`/api/questions/${subjectName}/basic`)
            .send({
                qName: "What is gravity?",
                options: ["Force", "Energy", "Mass", "Speed"],
                correctAnswer: "Force",
            });
 
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("difficulty", "basic");
        questionId = res.body._id;
 
        const subjectDoc = await Subject.findOne({ subjectName });
        expect(subjectDoc.questionsByDifficulty.basic).to.include(questionId);
    });
 
    it("should get questions by subject and difficulty (GET /api/questions/:subject/:difficulty)", async () => {
        const res = await chai.request(app)
            .get(`/api/questions/${subjectName}/basic`);
           
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.equal(1);
        expect(res.body[0]).to.have.property("qName", "What is gravity?");
    });
 
    it("should get question by ID (GET /api/questions/id/:id)", async () => {
        const res = await chai.request(app)
            .get(`/api/questions/id/${questionId}`);
 
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("qName", "What is gravity?");
    });
 
    it("should update a question (PUT /api/questions/:id)", async () => {
        const res = await chai.request(app)
            .put(`/api/questions/${questionId}`)
            .send({
                qName: "What is inertia?",
            });
           
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("qName", "What is inertia?");
    });
   
    it("should fail to create question if max limit of 10 reached", async () => {
        // Create 9 more questions to reach the limit of 10
        for (let i = 2; i <= 10; i++) {
            await chai.request(app)
                .post(`/api/questions/${subjectName}/basic`)
                .send({
                    qName: `Q${i}`,
                    options: ["O1", "O2", "O3", "O4"],
                    correctAnswer: "O1",
                });
        }
       
        const res = await chai.request(app)
            .post(`/api/questions/${subjectName}/basic`)
            .send({
                qName: "Q11",
                options: ["O1", "O2", "O3", "O4"],
                correctAnswer: "O1",
            });
           
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error", "Maximum 10 basic questions allowed for this subject");
    }).timeout(5000); 
 
    it("should delete a question (DELETE /api/questions/:id/:subject/:difficulty)", async () => {
        const res = await chai.request(app)
            .delete(`/api/questions/${questionId}/${subjectName}/basic`);
           
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Question deleted successfully");
 
        const deletedQuestion = await Question.findById(questionId);
        expect(deletedQuestion).to.be.null;
 
        const subjectDoc = await Subject.findOne({ subjectName });
        expect(subjectDoc.questionsByDifficulty.basic).to.not.include(questionId);
    });
});