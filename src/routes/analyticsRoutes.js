const express = require('express');
const router = express.Router();
const {
  getOverallStats,
  getProgress,
  getDifficultyAnalytics,
  getLeaderboard,
  getAdminStats,
  getStudentPerformance,
  getSubjectPerformance
} = require('../controllers/analyticsController');

router.get("/student/overall/:userId", getOverallStats);
router.get("/student/progress/:userId", getProgress);
router.get("/student/difficulty/:userId", getDifficultyAnalytics);
router.get("/student/leaderboard", getLeaderboard);

router.get("/admin/stats", getAdminStats);
router.get("/admin/students", getStudentPerformance);
router.get("/admin/subjects", getSubjectPerformance);

module.exports = router;