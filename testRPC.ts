import axios from "axios";

const moduleAddress = "0x27954378db5424cc3993e4e581975607440835f320d21aefade9909ccdc80628";
const moduleName = "cdp_multi";
const functionName = "convert_to_assets";
const typeArg = "0x1::supra_coin::SupraCoin";
const amount = 1000000;

async function testConvertToAssets() {
  try {
    const { data } = await axios.post(
      "https://rpc-mainnet.supra.com/rpc/v1/view",
      {
        function: `${moduleAddress}::${moduleName}::${functionName}`,
        type_arguments: [typeArg],
        arguments: [amount.toString()],
      },
      {
        headers: {
          "User-Agent": "Supra-Test/1.0",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ RPC Response:", data);
  } catch (err: any) {
    console.error("❌ RPC error:", err.response?.data || err.message);
  }
}

testConvertToAssets();
