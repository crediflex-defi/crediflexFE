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
import { useCalculateDynamicLtv } from "@/hooks/useCalculateDynamicLtv";
import { useAddCollateral } from "@/hooks/useDeposit";
import { useERC20TokenBalance } from "@/hooks/userERC20TokenBalance";
import { normalize } from "@/lib/bignumber";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useBorrow } from "@/hooks/useBorrow";
import { toast } from "@/hooks/use-toast";

export default function BorrowInterface() {
  const [collateralAmount, setCollateralAmount] = useState("1");
  const [borrowAmount, setBorrowAmount] = useState("2000");
  const { address } = useAccount();
  const balanceCollateral = useERC20TokenBalance(
    address,
    "0x80207b9bacc73dadac1c8a03c6a7128350df5c9e"
  );
  // const balanceBorrow = useERC20TokenBalance(
  //   address,
  //   "0x6acaccdace944619678054fe0ea03502ed557651"
  // );

  const { data: positions } = useReadContract({
    abi: mainAbi,
    address: "0x0EC0b333d125278BF90f4Aa7442B61B63363F956",
    functionName: "positions",
    args: [address],
    query: {
      enabled: !!address,
    },
  }) as {
    data: Array<string>;
  };

  const {} = useReadContracts({
    contracts: [
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
    ],
  });

  // const supplyShares = normalize((positions?.[0] as string) || "0", 18);
  // const borrowShares = normalize((positions?.[1] as string) || "0", 18);
  const collateral = normalize((positions?.[2] as string) || "0", 18);

  const { data, refetch: refetchLtv } = useCalculateDynamicLtv({
    userAddress: address,
  });

  const { mutation: depositCollateral } = useAddCollateral();
  const { mutation: borrow } = useBorrow();

  const ltvValue = parseFloat(normalize((data as string) || "0", 18)) * 100;

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
                    <div className="w-6 h-6 rounded-full bg-blue-500" />
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
                  Balance ${balanceCollateral.balance}
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
                          refetchLtv();
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
                    <div className="w-6 h-6 rounded-full bg-yellow-500" />
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
                  Available to borrow: loading...
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
                          refetchLtv();
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
                    <div className="text-sm text-neutral-500">max. 150%</div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <Slider
                    value={[ltvValue]}
                    max={150}
                    step={0.01}
                    disabled
                    // onValueChange={([value]) => setLtv(value)}
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
              <h2 className="text-lg font-semibold mb-4">Total Deposited</h2>
              <div className="text-5xl font-bold mb-4">
                {parseFloat(collateral).toFixed(2)} weth
              </div>
              <p className="text-neutral-400">
                Your total deposited value in USD
              </p>
              <p className="text-neutral-400">
                {parseFloat(collateral).toFixed(2)} weth
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Borrow Rate</h3>
                <div className="text-3xl font-bold text-green-400">
                  8.51% APR
                </div>
                <p className="text-neutral-400 mt-2">
                  Current interest rate for borrowing
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
