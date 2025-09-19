import express from "express";
import cors from "cors";
import metricsRoutes from "./routes/metrics";

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/protocol/metrics", metricsRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running with CORS enabled")
);
