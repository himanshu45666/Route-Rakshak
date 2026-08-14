const mongoose = require("mongoose");
const SOS = require("../models/SOS");

const sendSOS = async (req, res) => {
  try {
    const {
      driverId,
      driverName,
      vehicleNumber,
      emergencyType,
      location,
    } = req.body;

    // Check if an active SOS already exists
    const existingSOS = await SOS.findOne({
      driverId,
      status: { $in: ["Pending", "Accepted"] },
    });

    if (existingSOS) {
      return res.status(400).json({
        message:
          "An active SOS already exists. Please wait until it is resolved.",
      });
    }

    const sos = await SOS.create({
      driverId,
      driverName,
      vehicleNumber,
      emergencyType,
      location,
      status: "Pending",
    });

    console.log("✅ SOS Created:", sos);

    res.status(201).json({
      message: "SOS Sent Successfully",
      sos,
    });
  } catch (error) {
    console.log("SOS Controller Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptSOS = async (req, res) => {
  try {
    const { id } = req.params;

    const sos = await SOS.findByIdAndUpdate(
      id,
      { status: "Accepted" },
      { new: true }
    );

    res.json({
      message: "SOS Accepted Successfully",
      sos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resolveSOS = async (req, res) => {
  try {
    const { id } = req.params;

    const sos = await SOS.findById(id);

    if (!sos) {
      return res.status(404).json({
        message: "SOS not found",
      });
    }

    // Pehle Accept hona zaroori hai
    if (sos.status !== "Accepted") {
      return res.status(400).json({
        message: "Please accept the alert before resolving it.",
      });
    }

    sos.status = "Resolved";
    await sos.save();

    console.log("✅ SOS Resolved:", sos);

    res.json({
      message: "SOS Resolved Successfully",
      sos,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllSOS = async (req, res) => {
  try {
    const sosList = await SOS.find().sort({ createdAt: -1 });

    res.json(sosList);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendSOS,
  acceptSOS,
  resolveSOS,
  getAllSOS,
};