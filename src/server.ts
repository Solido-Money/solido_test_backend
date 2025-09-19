import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/metrics";

const app = express();

// 🔍 Debug logs
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

// ✅ Handle preflight explicitly (Render-safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    return res.sendStatus(200);
  }
  next();
});

// ✅ Apply normal CORS middleware for all other requests
app.use(cors({
  origin: "*", // or ["http://localhost:5173", "https://yourfrontend.com"]
}));

app.use(express.json());
app.use("/protocol/metrics", metricsRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server running with CORS")
);
