const mongoose = require("mongoose");
module.exports = mongoose.model("Ride", new mongoose.Schema({
  driverName: { type: String, required: true, trim: true }, driverEmail: { type: String, required: true, trim: true, lowercase: true },
  origin: { type: String, required: true, trim: true }, destination: { type: String, required: true, trim: true },
  departureTime: { type: Date, required: true }, availableSeats: { type: Number, required: true, min: 1 }, price: { type: Number, required: true, min: 0 },
  notes: { type: String, trim: true, maxlength: 300 }
}, { timestamps: true }));
