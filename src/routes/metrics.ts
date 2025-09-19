import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const module_address =
  "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628";
export const module_name = "cdp_multi";
export const supra_coin = "0x1::supra_coin::SupraCoin";
export const stsupra_coin =
  "0xa077104315d58de4a9e23dc66a4947e659609c0f95932a61f58089bc6c1bc729::vault_core::VaultShare";

const router = express.Router();
const SUPRA_RPC = process.env.SUPRA_RPC;
if (!SUPRA_RPC) throw new Error("❌ SUPRA_RPC not defined in .env");

// -------------------- Helpers --------------------

// Fetch price of a coin using get_collateral_price_raw
const fetchPrice = async (coinType: string): Promise<number> => {
  try {
    const res = await axios.post(`${SUPRA_RPC}/rpc/v1/view`, {
      function: `${module_address}::${module_name}::get_collateral_price_raw`,
      type_arguments: [coinType],
      arguments: [],
    });
    return Number(res.data?.result?.[0] ?? 0) / 1e8; // normalize with 8 decimals
  } catch (err: any) {
    console.error(`❌ Error fetching price for ${coinType}:`, err.message || err);
    return 0;
  }
};

// Fetch total system stats for a coin
const fetchTotalStats = async (
  coinType: string
): Promise<{ totalColl: number; totalDebt: number }> => {
  try {
    const res = await axios.post(`${SUPRA_RPC}/rpc/v1/view`, {
      function: `${module_address}::${module_name}::get_total_stats`,
      type_arguments: [coinType],
      arguments: [],
    });

    const result = res.data?.result?.[0] ?? [0, 0];
    const [rawColl, rawDebt] = result;

    return {
      totalColl: Number(rawColl) / 1e8,
      totalDebt: Number(rawDebt) / 1e8,
    };
  } catch (err: any) {
    console.error(`❌ Error fetching total stats for ${coinType}:`, err.message || err);
    return { totalColl: 0, totalDebt: 0 };
  }
};

// Fetch collateral configuration for a coin
const fetchConfig = async (coinType: string) => {
  try {
    const res = await axios.post(`${SUPRA_RPC}/rpc/v1/view`, {
      function: `${module_address}::${module_name}::get_collateral_config`,
      type_arguments: [coinType],
      arguments: [],
    });

   // console.log("DEBUG config result for", coinType, ":", JSON.stringify(res.data, null, 2));

    const result = res.data?.result;
    if (!result || !Array.isArray(result)) {
      throw new Error("Unexpected config format");
    }

    const [
      minimum_debt,
      mcr,
      borrow_rate,
      liquidation_reserve,
      liquidation_threshold,
      liquidation_penalty,
      redemption_fee,
      enabled,
      liquidation_fee_protocol,
      redemption_fee_gratuity,
    ] = result;

    return {
      minDebt: Number(minimum_debt) / 1e8, // ORE (8 decimals)
      MCR: Number(mcr) / 100, // 17000 -> 170%
      borrowRate: Number(borrow_rate) / 100, // 250 -> 2.5%
      liquidationReserve: Number(liquidation_reserve) / 1e8, // ORE
      liquidationThreshold: Number(liquidation_threshold) / 100, // 15000 -> 150%
      liquidationPenalty: Number(liquidation_penalty) / 100, // 1000 -> 10%
      redemptionFee: Number(redemption_fee) / 100, // 200 -> 2%
      enabled: Boolean(enabled),
      liquidationFeeProtocol: Number(liquidation_fee_protocol) / 100,
      redemptionFeeGratuity: Number(redemption_fee_gratuity) / 100,
    };
  } catch (err: any) {
    console.error(`❌ Error fetching config for ${coinType}:`, err.message || err);
    return null;
  }
};



// -------------------- API Route --------------------
router.get("/", async (req, res) => {
  try {
    const coins = [
      { name: "stSupraCoin", type: stsupra_coin },
      { name: "SupraCoin", type: supra_coin },
    ];

    const data = await Promise.all(
      coins.map(async (coin) => {
        const [price, { totalColl, totalDebt }, config] = await Promise.all([
          fetchPrice(coin.type),
          fetchTotalStats(coin.type),
          fetchConfig(coin.type),
        ]);

        return {
          token: coin.name,
          decimals: 8,
          price,
          ...config,
          totalColl: totalColl.toFixed(8),
          totalDebt: totalDebt.toFixed(8),
        };
      })
    );

    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error("❌ Failed to fetch metrics:", err.message || err);
    res.status(500).json({ success: false, message: "Failed to fetch metrics" });
  }
});

export default router;
