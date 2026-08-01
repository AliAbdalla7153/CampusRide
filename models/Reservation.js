const mongoose = require("mongoose");
module.exports = mongoose.model("Reservation", new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true }, riderName: { type: String, required: true, trim: true },
  riderEmail: { type: String, required: true, trim: true, lowercase: true }, seats: { type: Number, required: true, min: 1 }
}, { timestamps: true }));
