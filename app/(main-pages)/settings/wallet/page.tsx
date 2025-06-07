"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  EyeOff,
  Bell,
  RefreshCw,
} from "lucide-react";
import {
  BalanceSkeleton,
  TransactionHistorySkeleton,
  WalletPageSkeleton,
} from "@/components/wallet/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PaystackButton } from "react-paystack";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  description: string;
  amount: number;
  date: string;
  time: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "withdrawal",
    description: "Amount withdrawn",
    amount: -5922,
    date: "oct 27th",
    time: "15:64",
  },
  {
    id: "2",
    type: "transfer",
    description: "Transfer from Ayorinde Peter",
    amount: 1299,
    date: "oct 27th",
    time: "15:64",
  },
  {
    id: "3",
    type: "withdrawal",
    description: "Amount withdrawn",
    amount: -4500,
    date: "oct 27th",
    time: "15:64",
  },
  {
    id: "4",
    type: "withdrawal",
    description: "Amount withdrawn",
    amount: -6890,
    date: "oct 27th",
    time: "15:64",
  },
  {
    id: "5",
    type: "deposit",
    description: "Amount withdrawn",
    amount: -20000,
    date: "oct 27th",
    time: "15:64",
  },
  {
    id: "6",
    type: "deposit",
    description: "Amount deposited",
    amount: 70000,
    date: "oct 27th",
    time: "15:64",
  },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const user = useQuery(api.users.current)

  const balance = 50000.0;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshingBalance(false);
  };

  const handleRefreshTransactions = async () => {
    setIsLoadingTransactions(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoadingTransactions(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "transfer":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-green-600" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-orange-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    const formattedAmount = Math.abs(amount).toLocaleString();
    return (
      <span className={isPositive ? "text-green-600" : "text-red-500"}>
        {isPositive ? "+ " : "- "}₦{formattedAmount}
      </span>
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "deposits")
      return transaction.type === "deposit" || transaction.type === "transfer";
    if (activeTab === "withdrawals") return transaction.type === "withdrawal";
    return true;
  });

  if (isLoading) {
    return <WalletPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Card className="rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src="/placeholder.svg?height=48&width=48"
                    alt="Mbah Smith"
                  />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">Mbah Smith</h2>
                  <p className="text-sm text-gray-500">
                    welcome, lets make payment
                  </p>
                </div>
              </div>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  <span className="text-[10px]">1</span>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Wallet Balance Section */}
          <CardContent className="p-0">
            {isRefreshingBalance ? (
              <BalanceSkeleton />
            ) : (
              <div className="bg-orange-500 text-white p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm opacity-90">Wallet balance</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-white hover:bg-orange-600"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-white hover:bg-orange-600 ml-2"
                      onClick={handleRefreshBalance}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-3xl font-bold mb-6">
                    {showBalance
                      ? `₦${balance.toLocaleString()}.00`
                      : "₦••••••••"}
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-2xl p-4 mx-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center gap-2">
                        <ArrowDownToLine className="w-5 h-5" />
                        Deposit
                      </Button>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center gap-2">
                        <ArrowUpFromLine className="w-5 h-5" />
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        {isLoadingTransactions ? (
          <TransactionHistorySkeleton />
        ) : (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Transaction History</h3>
                <p className="text-sm text-gray-500">
                  Your recent financial activities
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshTransactions}
                className="text-gray-600 hover:text-gray-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Custom Tab Navigation */}
            <div className="mb-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`relative p-2 py-[2px] text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {activeTab === "all" && (
                    <div className="absolute inset-0 bg-orange-100 rounded-full -m-1" />
                  )}
                  <span className="relative">All</span>
                </button>
                <button
                  onClick={() => setActiveTab("deposits")}
                  className={`relative p-2 py-[2px] font-medium transition-colors ${
                    activeTab === "deposits"
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {activeTab === "deposits" && (
                    <div className="absolute inset-0 bg-orange-100 rounded-full -m-1" />
                  )}
                  <span className="relative">Deposits</span>
                </button>
                <button
                  onClick={() => setActiveTab("withdrawals")}
                  className={`relative p-2 py-[2px] text-sm font-medium transition-colors ${
                    activeTab === "withdrawals"
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {activeTab === "withdrawals" && (
                    <div className="absolute inset-0 bg-orange-100 rounded-full -m-1" />
                  )}
                  <span className="relative">Withdrawals</span>
                  {activeTab === "withdrawals" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Content */}
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  {getTransactionIcon(transaction.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.date}, {transaction.time}
                    </p>
                  </div>
                  <div className="text-right">
                    {formatAmount(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="">
          <Card className="overflow-hidden rounded-none">
            {/* Header */}
            <CardHeader className="bg-white  p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src="/placeholder.svg?height=64&width=64"
                      alt="Mbah Smith"
                    />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-2xl">Mbah Smith</h2>
                    <p className="text-gray-500">welcome, lets make payment</p>
                  </div>
                </div>
                <div className="relative">
                  <Bell className="w-7 h-7 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    <span className="text-[11px]">1</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Wallet Balance Section */}
            <CardContent className="p-0">
              {isRefreshingBalance ? (
                <BalanceSkeleton />
              ) : (
                <div className="bg-orange-500 text-white p-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-lg opacity-90">Wallet balance</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-2 text-white hover:bg-orange-600"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-2 text-white hover:bg-orange-600"
                        onClick={handleRefreshBalance}
                      >
                        <RefreshCw className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="text-5xl font-bold mb-8">
                      {showBalance
                        ? `₦${balance.toLocaleString()}.00`
                        : "₦••••••••"}
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-3xl p-6 mx-8">
                      <div className="grid grid-cols-2 gap-6">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-16 text-lg flex items-center gap-3">
                          <ArrowDownToLine className="w-6 h-6" />
                          Deposit
                        </Button>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-16 text-lg flex items-center gap-3">
                          <ArrowUpFromLine className="w-6 h-6" />
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction History */}
              {isLoadingTransactions ? (
                <TransactionHistorySkeleton />
              ) : (
                <div className="p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Transaction History
                      </h3>
                      <p className="text-gray-500">
                        Your recent financial activities
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshTransactions}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Custom Tab Navigation */}
                  <div className="mb-6">
                    <div className="flex items-center justify-around">
                      <button
                        onClick={() => setActiveTab("all")}
                        className={`relative pb-3 text-base font-medium transition-colors ${
                          activeTab === "all"
                            ? "text-orange-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {activeTab === "all" && (
                          <div className="absolute inset-0  rounded-full px-5 py-2 -m-2" />
                        )}
                        <span className="relative">All</span>
                        {activeTab === "all" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("deposits")}
                        className={`relative pb-3 text-base font-medium transition-colors ${
                          activeTab === "deposits"
                            ? "text-orange-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {activeTab === "deposits" && (
                          <div className="absolute inset-0  rounded-full px-5 py-2 -m-2" />
                        )}
                        <span className="relative">Deposits</span>
                        {activeTab === "deposits" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("withdrawals")}
                        className={`relative pb-3 text-base font-medium transition-colors ${
                          activeTab === "withdrawals"
                            ? "text-orange-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {activeTab === "withdrawals" && (
                          <div className="absolute inset-0  rounded-full px-5 py-2 -m-2" />
                        )}
                        <span className="relative">Withdrawals</span>
                        {activeTab === "withdrawals" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Transaction Content */}
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0"
                      >
                        {getTransactionIcon(transaction.type)}
                        <div className="flex-1">
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.date}, {transaction.time}
                          </p>
                        </div>
                        <div className="text-right text-lg font-medium">
                          {formatAmount(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
