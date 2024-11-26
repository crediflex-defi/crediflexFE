"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight } from "lucide-react";
import { BaseError, useAccount, useWriteContract } from "wagmi";
import avsAbi from "@/abi/avs.json";
export default function Home() {
  const { address } = useAccount();
  const { writeContract, error } = useWriteContract();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ConnectButton />

        <Card className="w-full max-w-md mx-4 backdrop-blur-lg bg-white/60 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              Credit Score Request
            </CardTitle>
            <CardDescription className="text-blue-600">
              Get your credit score with just one click
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <>
                <p className="text-blue-700">
                  Connect your wallet first before proceed
                </p>
                <Button
                  onClick={() => {
                    writeContract({
                      address: "0xc4327AD867E6e9a938e03815Ccdd4198ccE1023c",
                      abi: avsAbi,
                      functionName: "createNewTask",
                      args: [address],
                    });
                  }}
                  className="w-full group relative overflow-hidden bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
                >
                  <span className="relative z-10">Request Credit Score</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                {error && (
                  <div>
                    Error: {(error as BaseError).shortMessage || error.message}
                  </div>
                )}
              </>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
