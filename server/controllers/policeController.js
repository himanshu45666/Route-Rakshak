const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Police = require("../models/Police");

const registerPolice = async (req, res) => {
  try {
    const { name, policeId, station, password } = req.body;

    const existingPolice = await Police.findOne({ policeId });

    if (existingPolice) {
      return res.status(400).json({
        message: "Police already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const police = await Police.create({
      name,
      policeId,
      station,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Police Registered Successfully",
      police,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginPolice = async (req, res) => {
  try {
    console.log("Police Login Body:", req.body);
    const { policeId, password } = req.body;

    const police = await Police.findOne({ policeId });
    console.log("Police Found:", police);

    if (!police) {
      return res.status(404).json({
        message: "Police not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      police.password
    );
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: police._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    police.password = undefined;
    
    res.status(200).json({
      message: "Police Login Successful",
      token,
      police,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerPolice,
  loginPolice,
};