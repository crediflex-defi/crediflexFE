"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Info } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function BorrowInterface() {
  const [depositAmount, setDepositAmount] = useState("1")
  const [borrowAmount, setBorrowAmount] = useState("2000")
  const [ltv, setLtv] = useState(54.22)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

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
                  <h2 className="text-lg font-semibold text-neutral-900">Deposit</h2>
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
                    <span>wstETH</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-24 text-right"
                  />
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  ${(parseFloat(depositAmount) * 3688.83).toFixed(2)}
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Borrow</h2>
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
                    <span>DAI</span>
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
                  ${parseFloat(borrowAmount).toFixed(2)}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Loan to Value (LTV)</h2>
                    <p className="text-sm text-neutral-500">
                      Ratio of the borrowed value to the collateral value
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-neutral-900">{ltv.toFixed(2)}%</div>
                    <div className="text-sm text-neutral-500">max. 79.00%</div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <Slider
                    value={[ltv]}
                    max={100}
                    step={0.01}
                    onValueChange={([value]) => setLtv(value)}
                    className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary"
                  />

                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Aggressive</span>
                    <span>Liquidation</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Total Deposited</h2>
              <div className="text-5xl font-bold mb-4">
                ${(parseFloat(depositAmount) * 3688.83).toFixed(2)}
              </div>
              <p className="text-neutral-400">
                Your total deposited value in USD
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Borrow Rate</h3>
                <div className="text-3xl font-bold text-green-400">8.51% APR</div>
                <p className="text-neutral-400 mt-2">
                  Current interest rate for borrowing
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

