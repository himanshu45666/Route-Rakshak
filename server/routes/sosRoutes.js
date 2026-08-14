const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  sendSOS,
  acceptSOS,
  resolveSOS,
  getAllSOS,
} = require("../controllers/sosController");

router.post("/send", protect, sendSOS);
router.put("/accept/:id", protect, acceptSOS);
router.put("/resolve/:id", protect, resolveSOS);
router.get("/history", protect, getAllSOS);

module.exports = router;