// // src/fetchMetrics.ts
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import axios from "axios";
// import Metrics from "./models/Metrics.js"; // Use .js for ESM with ts-node --esm

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) throw new Error("MONGO_URI not set in .env");

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// // Example Supra RPC endpoint and tokens
// const SUPRA_RPC = process.env.SUPRA_RPC; // e.g., https://rpc-mainnet.supra.com/
// if (!SUPRA_RPC) throw new Error("SUPRA_RPC not set in .env");

// const TOKENS = [
//   {
//     name: "CASH",
//     id: "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628::cdp_multi::CASH",
//   },
//   {
//     name: "SupraCoin",
//     id: "0x1::supra_coin::SupraCoin",
//   },
//   {
//     name: "VaultShare",
//     id: "0xa077104315d58de4a9e23dc66a4947e659609c0f95932a61f58089bc6c1bc729::vault_core::VaultShare",
//   },
// ];

// // Function to fetch token price from Supra RPC
// const fetchTokenPrice = async (tokenId: string): Promise<number> => {
//   try {
//     const response = await axios.post(SUPRA_RPC, {
//       jsonrpc: "2.0",
//       id: 1,
//       method: "sui_getObject",
//       params: [tokenId],
//     });

//     // Example: extract price from Supra object
//     const price = Number(response.data.result?.data?.fields?.price || 0);
//     return price;
//   } catch (err) {
//     console.error("❌ Error fetching token price:", err);
//     return 0;
//   }
// };

// const updateMetrics = async () => {
//   await connectDB();

//   for (const token of TOKENS) {
//     const price = await fetchTokenPrice(token.id);
//     console.log(`Token: ${token.name}, Price: ${price}`);

//     const metric = await Metrics.findOne({ "metrics.token": token.name });
//     if (metric) {
//       // Update existing
//       await Metrics.updateOne(
//         { "metrics.token": token.name },
//         { $set: { "metrics.$.price": price } }
//       );
//       console.log(`✅ Updated ${token.name} price in DB`);
//     } else {
//       // Insert new
//       await Metrics.create({
//         metrics: [
//           {
//             token: token.name,
//             decimals: 8,
//             price,
//             MCR: 110,
//             minDebt: 100,
//             liquidationReserve: 50,
//             liquidationThreshold: 150,
//             liquidationPenalty: 5,
//             borrowRate: 2,
//             totalColl: 0,
//             totalDebt: 0,
//             maxMint: 100000,
//           },
//         ],
//       });
//       console.log(`✅ Inserted ${token.name} price in DB`);
//     }
//   }

//   console.log("✅ Metrics update completed");
//   process.exit(0);
// };

// updateMetrics().catch((err) => {
//   console.error("❌ Fatal error in fetchMetrics:", err);
//   process.exit(1);
// });



// src/routes/metrics.ts
// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// export const module_address =
//   "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628";
// export const module_name = "cdp_multi";

// const router = express.Router();
// const SUPRA_RPC = process.env.SUPRA_RPC;
// if (!SUPRA_RPC) throw new Error("❌ SUPRA_RPC not defined in .env");

// // Fetch stSUPRA price
// const fetchStSupraPrice = async (): Promise<number> => {
//   try {
//     const res = await axios.post(`${SUPRA_RPC}/rpc/v1/view`, {
//       function: `${module_address}::${module_name}::convert_to_assets`,
//       type_arguments: ["SupraCoin"], // underlying coin
//       arguments: ["100000000"], // 1 stSUPRA (1e8 decimals)
//     });
//     return Number(res.data?.result?.[0] ?? 0) / 1e8;
//   } catch (err: any) {
//     console.error("❌ Error fetching stSUPRA price:", err.message || err);
//     return 0;
//   }
// };

// // Fetch SUPRA price
// const fetchSupraPrice = async (): Promise<number> => {
//   try {
//     const res = await axios.post(`${SUPRA_RPC}/rpc/v1/view`, {
//       function: `${module_address}::${module_name}::convert_to_assets`,
//       type_arguments: ["bCash"], // stable coin type
//       arguments: ["1000000"], // 1 SUPRA (1e6 decimals)
//     });
//     return Number(res.data?.result?.[0] ?? 0) / 1e6;
//   } catch (err: any) {
//     console.error("❌ Error fetching SUPRA price:", err.message || err);
//     return 0;
//   }
// };

// router.get("/", async (req, res) => {
//   try {
//     const [stSupraPrice, supraPrice] = await Promise.all([
//       fetchStSupraPrice(),
//       fetchSupraPrice(),
//     ]);

//     const data = [
//       {
//         token: "stSupraCoin",
//         decimals: 8,
//         price: stSupraPrice,
//         MCR: 110,
//         minDebt: 100,
//         liquidationReserve: 50,
//         liquidationThreshold: 150,
//         liquidationPenalty: 5,
//         borrowRate: 2,
//         totalColl: 0,
//         totalDebt: 0,
//         maxMint: 100000,
//       },
//       {
//         token: "SupraCoin",
//         decimals: 6,
//         price: supraPrice,
//         MCR: 110,
//         minDebt: 100,
//         liquidationReserve: 50,
//         liquidationThreshold: 150,
//         liquidationPenalty: 5,
//         borrowRate: 2,
//         totalColl: 0,
//         totalDebt: 0,
//         maxMint: 100000,
//       },
//     ];

//     res.json({ success: true, count: data.length, data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Failed to fetch metrics" });
//   }
// });

// export default router;
