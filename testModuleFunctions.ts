// testModuleFunctions.ts
import axios from "axios";

const moduleAddress = "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628";
const moduleName = "cdp_multi";

async function listModuleFunctions() {
  try {
    const { data } = await axios.post(
      "https://rpc-mainnet.supra.com/rpc/v1/view",
      {
        module: `${moduleAddress}::${moduleName}`,
      },
      {
        headers: { "User-Agent": "Supra-ViewFunctions/1.0" },
      }
    );
    console.log("✅ Module functions:", data);
  } catch (err) {
    console.error("❌ RPC error:", err);
  }
}

listModuleFunctions();
