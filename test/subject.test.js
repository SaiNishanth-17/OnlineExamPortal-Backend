const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const Subject = require("../src/models/subjectSchema");
 
chai.use(chaiHttp);
const expect = chai.expect;
 
describe("Subject API", () => {
  let subjectId;
 
  before(async () => {
    await Subject.deleteMany({});
  });
 
  it("should create a new subject", async () => {
    const res = await chai.request(app).post("/api/subjects").send({
      subjectName: "Mathematics",
      description: "Algebra and Geometry",
    });
 
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
    subjectId = res.body._id;
  });
 
  it("should get all subjects", async () => {
    const res = await chai.request(app).get("/api/subjects");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });
 
  it("should get a subject by ID", async () => {
    const res = await chai.request(app).get(`/api/subjects/${subjectId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("subjectName", "Mathematics");
  });
 
  it("should update a subject", async () => {
    const res = await chai.request(app).put(`/api/subjects/${subjectId}`).send({
      description: "Updated description",
    });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("description", "Updated description");
  });
 
  it("should delete a subject", async () => {
    const res = await chai.request(app).delete(`/api/subjects/${subjectId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message");
  });
});
 
 