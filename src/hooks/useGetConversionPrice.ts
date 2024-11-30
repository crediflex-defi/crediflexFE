import { useReadContract } from "wagmi";
import mainAbi from "@/abi/main.json";

export const useGetConversionPrice = ({
  amountIn,
  dataFeedIn,
  dataFeedOut,
}: {
  amountIn: string;
  dataFeedIn: string;
  dataFeedOut: string;
}) => {
  return useReadContract({
    abi: mainAbi,
    address: "0x4C086Bb080792308C74e5B804907e7D35779a56A",
    functionName: "getConversionPrice",
    args: [amountIn, dataFeedIn, dataFeedOut],
    query: {
      enabled: !!amountIn && !!dataFeedIn && !!dataFeedOut,
    },
  });
};
