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
    address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
    functionName: "calculateDynamicLTV",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });
};
