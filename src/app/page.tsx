"use client"

import { useState } from "react"
import Link from "next/link"
import { useAccount, useWriteContract } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { motion } from "framer-motion"
import { ArrowRight, Loader } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import avsAbi from "@/abi/avs.json"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { writeContract, error, isPending } = useWriteContract()
  const [showError, setShowError] = useState(false)

  const handleCreditScoreRequest = () => {
    setShowError(false)
    writeContract({
      address: "0xc4327AD867E6e9a938e03815Ccdd4198ccE1023c",
      abi: avsAbi,
      functionName: "createNewTask",
      args: [address],
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
      <main className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-blue-800">Credit Score Portal</h1>
          <p className="text-lg text-blue-600">Secure, Fast, and Reliable Credit Scoring</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-800">Account Status</CardTitle>
                <CardDescription className="text-blue-600">
                  {isConnected ? "Your wallet is connected" : "Connect your wallet to proceed"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {isConnected ? (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-600">Connected Address:</p>
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm">{address}</code>
                  </div>
                ) : (
                  <ConnectButton />
                )}
                <Button asChild className="mt-4 w-full">
                  <Link href="/dashboard">
                    Go To Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-800">Credit Score Request</CardTitle>
                <CardDescription className="text-blue-600">
                  Get your credit score with just one click
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleCreditScoreRequest}
                    disabled={!isConnected || isPending}
                    className="relative w-full overflow-hidden bg-blue-500 text-white transition-all duration-300 hover:bg-blue-600"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isPending ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      {isPending ? "Processing..." : "Request Credit Score"}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </Button>
                  {error && showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded bg-red-100 p-3 text-sm text-red-700"
                    >
                      Error: {error.message}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

