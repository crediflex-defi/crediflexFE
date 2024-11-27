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
    address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
    functionName: "getConversionPrice",
    args: [amountIn, dataFeedIn, dataFeedOut],
    query: {
      enabled: !!amountIn && !!dataFeedIn && !!dataFeedOut,
    },
  });
};
