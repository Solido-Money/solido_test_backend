"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// mock data
const mockMetrics = {
    tvl: 1234567,
    pusdSupply: 890123,
    timestamp: new Date().toISOString(),
};
router.get("/metrics", (req, res) => {
    res.json({
        success: true,
        data: mockMetrics,
    });
});
exports.default = router;
