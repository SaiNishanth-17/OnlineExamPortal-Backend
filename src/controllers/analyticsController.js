const mongoose = require("mongoose");
const Users = require("../models/userSchema");
const Subject = require("../models/subjectSchema");
const CompletedExam = require("../models/completedExamsSchema");

exports.getOverallStats = async (req, res) => {
  try {
    const { userId } = req.params;
 
    const result = await CompletedExam.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          avgScore: { $avg: "$score" },
          passedExams: { $sum: { $cond: [{ $gte: ["$score", 40] }, 1, 0] } }
        }
      }
    ]);
 
    if (!result.length) return res.json({ totalExams: 0, avgScore: 0, passingRate: 0 });
 
    const stats = result[0];
    const passingRate = Math.round((stats.passedExams / stats.totalExams) * 100);
 
    res.json({
      totalExams: stats.totalExams,
      avgScore: Math.round(stats.avgScore),
      passingRate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
exports.getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
 
    const totalSubjects = await Subject.countDocuments();
    const totalPossible = totalSubjects * 3;
 
    const completed = await CompletedExam.countDocuments({ userId });
 
    const progress = Math.round((completed / totalPossible) * 100);
 
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
 
exports.getDifficultyAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
 
    const result = await CompletedExam.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { examName: "$examName", difficulty: "$difficulty" },
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 }
        }
      },
      {
        $project: {
          examName: "$_id.examName",
          difficulty: "$_id.difficulty",
          avgScore: { $round: ["$avgScore", 0] },
          attempts: 1,
          _id: 0
        }
      },
      { $sort: { _id: 1 } }
    ]);
 
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
 
exports.getLeaderboard = async (req, res) => {
  try {
    const result = await CompletedExam.aggregate([
      {
        $group: {
          _id: "$userId",
          avgScore: { $avg: "$score" },
          totalExams: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user._id",
          name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          avgScore: { $round: ["$avgScore", 0] },
          totalExams: 1
        }
      },
      { $sort: { avgScore: -1, totalExams: -1 } }
    ]);
 
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
 
 
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await Users.countDocuments({
      role: { $regex: /^student$/i }
    });
 
    const totalSubjects = await Subject.countDocuments();
    const totalExams = totalSubjects ;
 
    const passed = await CompletedExam.countDocuments({
      $expr: { $gte: [{ $toDouble: "$score" }, 40] }
    });
 
    const attempts = await CompletedExam.countDocuments();
 
    const passRate = attempts === 0 ? 0 : Math.round((passed / attempts) * 100);
 
    res.json({ totalStudents, totalExams, passRate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
 
 
exports.getStudentPerformance = async (req, res) => {
  try {
    const result = await CompletedExam.aggregate([
      {
        $group: {
          _id: "$userId",
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 },
          passed: { $sum: { $cond: [{ $gte: ["$score", 40] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          avgScore: { $round: ["$avgScore", 0] },
          attempts: 1,
          passRate: {
            $round: [{ $multiply: [{ $divide: ["$passed", "$attempts"] }, 100] }, 0]
          }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);
 
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
 
exports.getSubjectPerformance = async (req, res) => {
  try {
    const result = await CompletedExam.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "examName",
          foreignField: "subjectName", 
          as: "subject"
        }
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: "$examName",
          subjectName: { $first: "$examName" },
          avgScore: { $avg: "$score" },
          attempts: { $sum: 1 }
        }
      },
      {
        $project: {
          subjectName: 1,
          avgScore: { $round: ["$avgScore", 0] },
          attempts: 1,
          _id: 0
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
