import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/metrics";

const app = express();

// ✅ Use CORS middleware properly
app.use(cors({
  origin: "*", // or ['http://localhost:5173'] for specific frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

app.use(express.json());
app.use("/protocol/metrics", metricsRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running with CORS")
);
