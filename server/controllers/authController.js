const bcrypt = require("bcryptjs");
const Driver = require("../models/Driver");

const registerDriver = async (req, res) => {
  try {
    const { name, phone, vehicleNumber, password } = req.body;

    const existingDriver = await Driver.findOne({ phone });

    if (existingDriver) {
      return res.status(400).json({
        message: "Driver already exists",
      });
    }

const hashedPassword = await bcrypt.hash(password, 10);

const driver = await Driver.create({
  name,
  phone,
  vehicleNumber,
  password: hashedPassword,
});

    res.status(201).json({
      message: "Driver Registered Successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const jwt = require("jsonwebtoken");

const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const driver = await Driver.findOne({ phone });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
  { id: driver._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

driver.password = undefined;

    res.status(200).json({
      message: "Login Successful",
      token,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
};
