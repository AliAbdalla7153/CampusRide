require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");
const ridesRouter = require("./routes/rides");
const reservationsRouter = require("./routes/reservations");

const app = express();
const port = process.env.PORT || 3000;

// Some local network DNS servers reject MongoDB Atlas SRV lookups.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/rides", ridesRouter);
app.use("/api/reservations", reservationsRouter);

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", message: "CampusRide server is running." });
});

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    }
  } else {
    console.warn("MONGODB_URI is not set. Starting without a database connection.");
  }

  app.listen(port, () => {
    console.log(`CampusRide is running at http://localhost:${port}`);
  });
}

startServer();
