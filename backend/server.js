const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));





app.listen(5000, () => console.log("Server running on port 5000"));
