import express from "express";
import dotenv from "dotenv";
import metricsRoutes from "./routes/metrics";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "API Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Metrics route
app.use("/protocol/metrics", metricsRoutes);

app.listen(PORT, () => {
  console.log(`🌐 API Server running on port ${PORT}`);
});
