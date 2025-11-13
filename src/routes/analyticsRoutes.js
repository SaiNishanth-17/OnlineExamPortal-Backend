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
const authenticate = require('../middlewares/authMiddleware');

router.get("/student/overall/:userId", authenticate,getOverallStats);
router.get("/student/progress/:userId", authenticate, getProgress);
router.get("/student/difficulty/:userId", authenticate, getDifficultyAnalytics);
router.get("/student/leaderboard",authenticate, getLeaderboard);

router.get("/admin/stats", authenticate, getAdminStats);
router.get("/admin/students", authenticate, getStudentPerformance);
router.get("/admin/subjects", authenticate, getSubjectPerformance);

module.exports = router;