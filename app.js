const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./src/config/passport")(passport);

const logger = require("./src/middlewares/logger");
const errorHandler = require("./src/middlewares/errorHandler");

const userRoutes = require("./src/routes/authRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const submitExamRoutes = require("./src/routes/submitExamRoutes");

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    maxAge: 360,
  })
);

app.use("/api/auth", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/exams", submitExamRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Exam API");
});

app.use(errorHandler);

module.exports = app;