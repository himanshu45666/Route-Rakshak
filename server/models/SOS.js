const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    driverName: {
  type: String,
  required: true,
},

vehicleNumber: {
  type: String,
  required: true,
},

emergencyType: {
  type: String,
  required: true,
},

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SOS", sosSchema);