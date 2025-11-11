require("dotenv").config();
const app = require("./app");
const db = require("./src/config/db.config");

const PORT = process.env.PORT || 5000;

db.on("connected", () => {
  console.log("MongoDB connected successfully");
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});