const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { detectEmergencyType, chatWithAI } = require("../controllers/aiController");

router.post("/detect-emergency", protect, detectEmergencyType);
router.post("/chat", protect, chatWithAI);

module.exports = router;