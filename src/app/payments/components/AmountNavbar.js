import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  IndianRupee,
  BanknoteArrowDown,
  Landmark,
  BanknoteArrowUp,
} from "lucide-react";
function AmountNavbar() {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Card className={`h-20 py-4 w-35 mr-4`}>
          <CardContent>
            <span className="flex items-center mb-2">
              <BanknoteArrowDown size={15} />
              <p className="text-sm font-semibold ml-2">OB</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#00b8db" size={15} />
                <p className="text-cyan-500 font-semibold ml-2">500000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
        <Card className="h-20 py-4 w-35 mr-4">
          <CardContent>
            <span className="flex items-center mb-2">
              <BanknoteArrowDown size={15} />
              <p className="text-sm font-semibold ml-2">Cash</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#5cbc65" size={15} />
                <p className="text-green-500 font-semibold ml-2">500000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
        <Card className="h-20 py-4 w-35 mr-4">
          <CardContent>
            <span className="flex items-center mb-2">
              <BanknoteArrowUp size={15} />
              <p className="text-sm font-semibold ml-2">Expenses</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#db4545" size={15} />
                <p className="text-red-500 font-semibold ml-2">5000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
        <Card className="h-20 py-4 w-40 mr-4">
          <CardContent>
            <span className="flex items-center mb-2">
              <BanknoteArrowDown size={15} />
              <p className="text-sm font-semibold ml-2">Total Cash</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#ff6900" size={15} />
                <p className="text-orange-500 font-semibold ml-2">5000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
        <Card className="h-20 py-4 w-35 mr-4">
          <CardContent>
            <span className="flex items-center mb-2">
              <Landmark size={15} />
              <p className="text-sm font-semibold ml-2">UPI</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#62748e" size={15} />
                <p className="text-slate-500 font-semibold ml-2">5000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
        <Card className="h-20 py-4 w-35 mr-4">
          <CardContent>
            <span className="flex items-center mb-2">
              <BanknoteArrowDown size={15} />
              <p className="text-sm font-semibold ml-2">CB</p>
            </span>
            <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
              <span className="flex items-center">
                <IndianRupee color="#00b8db" size={15} />
                <p className="text-cyan-500  font-semibold ml-2">5000</p>
              </span>
            </h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AmountNavbar;
