"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKENS = void 0;
exports.fetchTokenData = fetchTokenData;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// Tokens with contract object IDs
exports.TOKENS = [
    {
        name: "CASH",
        id: "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628::cdp_multi::CASH",
    },
    {
        name: "SupraCoin",
        id: "0x1::supra_coin::SupraCoin",
    },
    {
        name: "stSupraCoin",
        id: "0xa077104315d58de4a9e23dc66a4947e659609c0f95932a61f58089bc6c1bc729::vault_core::VaultShare",
    },
];
// Type-safe SUPRA_RPC
const SUPRA_RPC = (_a = process.env.SUPRA_RPC) !== null && _a !== void 0 ? _a : "";
if (!SUPRA_RPC) {
    throw new Error("❌ SUPRA_RPC not defined in .env");
}
console.log("🔗 Using Supra RPC:", SUPRA_RPC);
// Fetch all relevant fields from the contract object
async function fetchTokenData(tokenId) {
    var _a, _b;
    try {
        const response = await axios_1.default.post(SUPRA_RPC, {
            jsonrpc: "2.0",
            id: 1,
            method: "sui_getObject",
            params: [tokenId],
        });
        const fields = ((_b = (_a = response.data.result) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.fields) || {};
        return {
            price: Number(fields.price || 0),
            totalColl: Number(fields.total_collateral || 0),
            totalDebt: Number(fields.total_debt || 0),
            MCR: Number(fields.MCR || 110),
            minDebt: Number(fields.min_debt || 100),
            liquidationReserve: Number(fields.liquidation_reserve || 50),
            liquidationThreshold: Number(fields.liquidation_threshold || 150),
            liquidationPenalty: Number(fields.liquidation_penalty || 5),
            borrowRate: Number(fields.borrow_rate || 2),
            maxMint: Number(fields.max_mint || 100000),
        };
    }
    catch (err) {
        console.error(`❌ Error fetching data for ${tokenId}:`, err);
        return {
            price: 0,
            totalColl: 0,
            totalDebt: 0,
            MCR: 110,
            minDebt: 100,
            liquidationReserve: 50,
            liquidationThreshold: 150,
            liquidationPenalty: 5,
            borrowRate: 2,
            maxMint: 100000,
        };
    }
}
