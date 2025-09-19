import express from "express";
import metricsRoutes from "./routes/metrics";

const app = express();

// -------------------- CORS Middleware --------------------
app.use((req, res, next) => {
  // Allow all origins
  res.header("Access-Control-Allow-Origin", "*");
  // Allowed HTTP methods
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  // Allowed headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // If this is a preflight request, respond immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }

  next();
});

app.use(express.json());
app.use("/protocol/metrics", metricsRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running with forced CORS headers")
);
