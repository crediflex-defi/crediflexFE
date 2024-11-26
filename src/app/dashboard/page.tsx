import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";

export default function BorrowInterface() {
  return (
    <div className="min-h-screen bg-[#fdf8f6] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-medium text-neutral-900">Dashboard</h1>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {/* Deposit and Borrow Section */}
            <div className="grid gap-4 md:grid-cols-2 items-start">
              {/* Deposit Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium">Deposit</h2>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 ">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500" />
                    <span>wstETH</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Input type="number" value="1" className="w-24 text-right" />
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  $3,688.83
                </div>
              </Card>

              {/* Borrow Card */}
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Borrow</h2>
                <div className="flex items-center justify-between mb-2">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-500" />
                    <span>DAI</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value="2000"
                    className="w-24 text-right"
                  />
                </div>
                <div className="text-sm text-neutral-500 text-right">
                  $2,000.00
                </div>
              </Card>
            </div>

            {/* LTV Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-medium">Loan to Value (LTV)</h2>
                  <p className="text-sm text-neutral-500">
                    Ratio of the collateral value to the borrowed value
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">54.22%</div>
                  <div className="text-sm text-neutral-500">max. 79.00%</div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <Slider
                  defaultValue={[54.22]}
                  max={100}
                  step={0.01}
                  disabled={true}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />

                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                  <span>Liquidation</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Borrow Rate Card */}
          <Card className="bg-neutral-900 text-white p-6">
            <h2 className="text-lg font-medium mb-2">Total Deposited: </h2>
            {/* <div className="text-5xl font-medium mb-4">8.51%</div>
            <p className="text-neutral-400">
              Borrow DAI or USDS directly from SKY
            </p> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
