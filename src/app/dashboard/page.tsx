"use client";

import { motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

import mainAbi from "@/abi/main.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useBorrow } from "@/hooks/useBorrow";
import { useAddCollateral } from "@/hooks/useDeposit";
import { useGetConversionPrice } from "@/hooks/useGetConversionPrice";
import { useGetCurrentUserCscore } from "@/hooks/useGetCscore";
import { useERC20TokenBalance } from "@/hooks/userERC20TokenBalance";
import { normalize, normalizeBN } from "@/lib/bignumber";
import Image from "next/image";
import { useAccount, useReadContracts } from "wagmi";

// Define the expected type for positionData
type PositionData = {
  result: [string, string, string];
};

export default function BorrowInterface() {
  const [collateralAmount, setCollateralAmount] = useState("1");
  const [borrowAmount, setBorrowAmount] = useState("2000");
  const { address } = useAccount();
  const balanceCollateral = useERC20TokenBalance(
    address,
    "0x80207b9bacc73dadac1c8a03c6a7128350df5c9e"
  );
  const { data: positionData, refetch: refetchPositions } = useReadContracts({
    contracts: [
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "positions",
        args: [address],
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "calculateDynamicLTV",
        args: [address],
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "totalBorrowAssets",
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "totalBorrowShares",
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "totalSupplyAssets",
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "totalSupplyShares",
      },
      {
        abi: mainAbi,
        address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
        functionName: "calculateHealth",
      },
    ],
    query: {
      enabled: !!address,
    },
  });
  const { data: cScore } = useGetCurrentUserCscore() as {
    data: { cScore: string };
    isPending: boolean;
  };
  const { mutation: depositCollateral } = useAddCollateral();
  const { mutation: borrow } = useBorrow();
  const { data: conversionPrice } = useGetConversionPrice({
    amountIn: (positionData?.[0] as PositionData)?.result?.[2] ?? "0",
    dataFeedIn: "0x122e4C08f927AD85534Fc19FD5f3BC607b00C731",
    dataFeedOut: "0x27D0Dd86F00b59aD528f1D9B699847A588fbA2C7",
  });

  const userBorrowAssets = normalizeBN(
    ((positionData?.[0] as PositionData)?.result?.[1] ?? "0") as string,
    18
  )
    .multipliedBy(normalizeBN((positionData?.[2].result as string) ?? "0", 18))
    .div(normalizeBN((positionData?.[3].result as string) ?? "0", 18));

  const availableToBorrow = normalizeBN((conversionPrice as string) ?? "0", 18)
    .multipliedBy(normalizeBN((positionData?.[1].result as string) ?? "0", 18))
    .minus(userBorrowAssets);

  const networth = normalizeBN((conversionPrice as string) ?? "0", 18).minus(
    userBorrowAssets
  );

  // const health = normalizeBN((positionData?.[6].result as string) ?? "0", 18);

  const collateral = normalize(
    ((positionData?.[0] as PositionData)?.result?.[2] ?? "0") as string,
    18
  );

  const normalizedCscore = parseFloat(normalize(cScore?.cScore || "0", 18));

  const ltvValue =
    parseFloat(normalize((positionData?.[1]?.result ?? "0") as string, 18)) *
    100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f6] to-[#f6e6e0] p-8">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold text-neutral-900"
          variants={itemVariants}
        >
          Borrow Dashboard
        </motion.h1>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <motion.div
              className="grid gap-4 md:grid-cols-2 items-start"
              variants={itemVariants}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Collateral
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-neutral-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deposit your assets as collateral</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Image
                      className="rounded-full"
                      src="https://assets.coingecko.com/coins/images/37405/standard/tokens.png?1714372859"
                      alt="weth"
                      width={24}
                      height={24}
                    />
                    <span>weth</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    className="w-24 text-right"
                  />
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  Balance {parseFloat(collateral).toFixed(2)} weth
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  Total Deposited Collateral {balanceCollateral.balance} weth
                </div>
                <Button
                  disabled={depositCollateral.isPending}
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => {
                    depositCollateral.mutate(
                      {
                        amount: collateralAmount,
                      },
                      {
                        onSuccess() {
                          toast({
                            title: "Deposited successfully",
                            description: "You have successfully deposited",
                          });
                          refetchPositions();
                        },
                        onError(error) {
                          toast({
                            title: "Error",
                            description: error.message,
                          });
                        },
                      }
                    );
                  }}
                >
                  {depositCollateral.isPending
                    ? "Depositing..."
                    : "Deposit Collateral"}
                </Button>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Borrow
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-neutral-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Borrow assets against your collateral</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Image
                      className="rounded-full"
                      src="https://assets.coingecko.com/coins/images/33613/standard/USDE.png?1716355685"
                      alt="usde"
                      width={24}
                      height={24}
                    />
                    <span>usde</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="w-24 text-right"
                  />
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  Available to borrow: {availableToBorrow.toFixed(2)} usde
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  Your borrowed value: {userBorrowAssets.toFixed(2)} usde
                </div>
                <Button
                  disabled={borrow.isPending}
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => {
                    borrow.mutate(
                      {
                        amount: borrowAmount,
                      },
                      {
                        onSuccess() {
                          toast({
                            title: "Borrowed successfully",
                            description: "You have successfully borrowed",
                          });
                        },
                        onError(error) {
                          toast({
                            title: "Error",
                            description: error.message,
                          });
                        },
                      }
                    );
                  }}
                >
                  {borrow.isPending ? "Borrowing..." : "Borrow"}
                </Button>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Loan to Value (LTV)
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Ratio of the borrowed value to the collateral value
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-neutral-900">
                      {ltvValue.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <Slider
                    value={[ltvValue]}
                    max={150}
                    step={0.01}
                    disabled
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary"
                  />

                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Liquidation</span>
                    <span>Aggressive</span>
                    <span>Moderate</span>
                    <span>Conservative</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Your Networth in USD
              </h2>
              <div className="text-5xl font-bold mb-4">
                $ {networth.toFixed(2)}
              </div>
              <h2 className="text-md font-semibold mb-4">
                Your credit score is
              </h2>
              <div className="text-3xl font-bold mb-4">
                {normalizedCscore.toFixed(4)}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Borrow Rate</h3>
                <div className="text-2xl font-bold text-green-400">10% APR</div>
                <p className="text-neutral-400 mt-2">
                  Current interest rate for borrowing
                </p>
                {/* <div className="text-sm text-neutral-500">
                  Health: {health.toFixed(2)}
                </div> */}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
