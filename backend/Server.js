const express = require("express");
const db = require("./db");
const customarRoutes = require("./routes/customers");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
const PORT = 5000;

app.use(express.json());
app.use("/api/customers", customarRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
