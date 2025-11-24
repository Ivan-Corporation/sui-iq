import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { TESTNET_IQ_PACKAGE_ID } from "./constants";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: { iqPackageId: TESTNET_IQ_PACKAGE_ID },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: { iqPackageId: TESTNET_IQ_PACKAGE_ID },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: { iqPackageId: TESTNET_IQ_PACKAGE_ID },
    },
  });

export { networkConfig, useNetworkVariable, useNetworkVariables };
