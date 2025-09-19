import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/metrics";

const app = express();

// 🔍 Log all requests
app.use((req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.url);
  console.log("   Origin:", req.headers.origin);
  next();
});

// ✅ CORS middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  optionsSuccessStatus: 200,
}));

// ✅ Explicit preflight handler (Express 5 safe)
app.options(/.*/, cors(), (req, res) => {
  console.log("✅ Preflight handled for:", req.headers.origin);
  res.sendStatus(200);
});

app.use(express.json());
app.use("/protocol/metrics", metricsRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server running with CORS")
);
