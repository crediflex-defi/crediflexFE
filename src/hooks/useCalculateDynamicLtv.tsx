import mainAbi from "@/abi/main.json";
import { HexAddress } from "@/lib/type";
import { useReadContract } from "wagmi";

export const useCalculateDynamicLtv = ({
  userAddress,
}: {
  userAddress?: HexAddress;
}) => {
  return useReadContract({
    abi: mainAbi,
    address: "0x4C086Bb080792308C74e5B804907e7D35779a56A",
    functionName: "calculateDynamicLTV",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });
};
