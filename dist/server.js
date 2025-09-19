"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const metrics_1 = __importDefault(require("./routes/metrics"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Health check
app.get("/", (req, res) => {
    res.json({
        message: "API Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});
// Metrics route
app.use("/protocol/metrics", metrics_1.default);
app.listen(PORT, () => {
    console.log(`🌐 API Server running on port ${PORT}`);
});
