const express = require("express");

const router = express.Router();

const {
  registerPolice,
  loginPolice,
} = require("../controllers/policeController");

router.post("/register", registerPolice);
router.post("/login", loginPolice);

module.exports = router;