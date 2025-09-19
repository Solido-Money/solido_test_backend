import { Router } from "express";

const router = Router();

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

export default router;
