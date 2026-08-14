const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    policeId: {
      type: String,
      required: true,
      unique: true,
    },

    station: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Police", policeSchema);