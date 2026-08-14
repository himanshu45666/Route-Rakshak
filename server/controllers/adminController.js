const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const registerAdmin = async (req, res) => {
  try {
    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin Created Successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
     console.log(req.body);
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );
console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      "routerakshaksecret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Admin Login Successful",
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};