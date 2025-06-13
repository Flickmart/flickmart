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
import TransactionDetails from "@/components/wallet/transaction-details";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PaystackButton } from "react-paystack";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";

interface PaystackConfig {
  email: string;
  amount: number;
  publicKey: string;
  reference: string;
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [paystackReference, setPaystackReference] = useState<string>("");
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const user = useQuery(api.users.current);
  const wallet = useQuery(
    api.wallet.getWalletByUserId,
    user ? { userId: user._id } : "skip"
  );
  const transactions = useQuery(
    api.transactions.getByUserId,
    user ? { userId: user._id } : "skip"
  );

  const { getToken } = useAuth();

  const balance = wallet?.balance ? wallet?.balance / 100 : 0;

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

  const handleWithdraw = async () => {
    if (!user) {
      setError("Log in to fund your wallet.");
      return;
    }
    try {
      setError(null);
         // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Unauthorised user");
        setIsInitializing(false);
        return;
      }
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_number: "9042350500",
            bank_code: "999992", // Opay as example
            amount: 5000, // NGN 5000
            name: "Ebuka Dev",
          }),
        }
      );
    } catch (err) {
      setError("Error withdrawing funds.");
      toast.error("Error withdrawing funds.");
    }
  };

  const handleInitializePayment = async () => {
    if (amount <= 0) {
      setError("Please enter a valid amount.");
      toast.error("Amount invalid");
      return;
    }
    if (!user) {
      setError("Log in to fund your wallet.");
      return;
    }
    try {
      setError(null);
      setIsInitializing(true);
      setIsPaystackModalOpen(true);
      // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Unauthorised user");
        setIsInitializing(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email, amount }),
        }
      );
      const data = await response.json();
      if (data.status) {
        setPaystackReference(data.data.reference);
      } else {
        setError("Failed to initialize payment.");
        toast.error("Failed to initialize payment.");
        setIsPaystackModalOpen(false);
      }
    } catch (err) {
      setError("Error initializing payment.");
      setIsPaystackModalOpen(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePaystackSuccess = async (response: { reference: string }) => {
    console.log(response);
    try {
      // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("User not authenticated.");
        setIsPaystackModalOpen(false);
        return;
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reference: response.reference,
            userId: user?._id,
          }),
        }
      );
      const data = await result.json();
      if (data.status) {
        toast.success("Payment successful! Wallet updated.");
        setAmount(0);
        setPaystackReference("");
        setIsPaystackModalOpen(false);
        setError(null);
      } else {
        toast.error("We coudn't verify your transaction");
        setError("Payment verification failed.");
        setIsPaystackModalOpen(false);
      }
    } catch (err) {
      setError("Error verifying payment.");
      setIsPaystackModalOpen(false);
    }
  };

  const handlePaystackClose = () => {
    setError("Payment cancelled.");
    toast.info("Paystack transaction closed");
    setPaystackReference("");
    setIsPaystackModalOpen(false);
  };

  const paystackConfig: PaystackConfig = {
    email: user?.email ?? "",
    amount: amount * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    reference: paystackReference, 
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "deposits")
      return (
        transaction.type === "funding" ||
        transaction.type === "transfer_in" ||
        transaction.type === "escrow_refund"
      );
    if (activeTab === "withdrawals") return transaction.type === "withdrawal";
    return true;
  });

  const isLoadingUser = user === undefined;
  const isLoadingData =
    isLoadingUser || wallet === undefined || transactions === undefined;
  if (isLoadingData || isLoading) {
    return <WalletPageSkeleton />;
  }

  // Ensure user exists before proceeding
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Card className="rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500">
                    Welcome, let's make payment
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
                      <Dialog open={open} onOpenChange={setOpen}>
                        <form>
                          <DialogTrigger asChild>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center gap-2">
                              <ArrowDownToLine className="w-5 h-5" />
                              Deposit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Deposit money</DialogTitle>
                              <DialogDescription>
                                Deposit money into your wallet using a bank
                                transfer or card payment.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="name-1">Amount</Label>
                                <Input
                                  id="name-1"
                                  name="deposit-amount"
                                  onChange={(e) => {
                                    setAmount(Number(e.target.value));
                                  }}
                                  type="number"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              {paystackReference ? (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Cancel Payment?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this
                                        payment? Your payment initialization
                                        will be lost.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        No, continue payment
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          setPaystackReference("");
                                          setIsPaystackModalOpen(false);
                                          setOpen(false);
                                        }}
                                      >
                                        Yes, cancel payment
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              ) : (
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                              )}
                              {error && (
                                <p className="text-red-500 text-sm mb-2">
                                  {error}
                                </p>
                              )}
                              {paystackReference && isPaystackModalOpen ? (
                                <PaystackButton
                                  {...paystackConfig}
                                  onSuccess={handlePaystackSuccess}
                                  onClose={handlePaystackClose}
                                  className="w-full"
                                >
                                  <Button
                                    onClick={() => setOpen(false)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center justify-center gap-2 w-full"
                                  >
                                    Deposit
                                  </Button>
                                </PaystackButton>
                              ) : (
                                <Button
                                  onClick={handleInitializePayment}
                                  disabled={isInitializing}
                                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center justify-center gap-2 w-full"
                                >
                                  {isInitializing ? (
                                    <>
                                      <RefreshCw className="w-5 h-5 animate-spin" />
                                      Initializing...
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownToLine className="w-5 h-5" />
                                      Deposit
                                    </>
                                  )}
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </form>
                      </Dialog>

                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12 flex items-center gap-2" onClick={handleWithdraw}>
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
              {filteredTransactions?.map((transaction) => (
                <TransactionDetails
                  key={transaction._id}
                  transaction={transaction}
                  user={user}
                  handlePaystackSuccess={handlePaystackSuccess}
                  handlePaystackClose={handlePaystackClose}
                />
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
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-lg">{user.name}</h2>
                    <p className="text-sm text-gray-500">
                      Welcome, let's make payment
                    </p>
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
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-16 text-lg flex items-center gap-3">
                              <ArrowDownToLine className="w-6 h-6" />
                              Deposit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Deposit money</DialogTitle>
                              <DialogDescription>
                                Deposit money into your wallet using a bank
                                transfer or card payment.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="name-1">Amount</Label>
                                <Input
                                  id="name-1"
                                  name="deposit-amount"
                                  type="number"
                                  onChange={(e) => {
                                    setAmount(Number(e.target.value));
                                  }}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              {paystackReference ? (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Cancel Payment?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this
                                        payment? Your payment initialization
                                        will be lost.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        No, continue payment
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          setPaystackReference("");
                                          setIsPaystackModalOpen(false);
                                          setOpen(false);
                                        }}
                                      >
                                        Yes, cancel payment
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              ) : (
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                              )}
                              {error && (
                                <p className="text-red-500 text-sm mb-2">
                                  {error}
                                </p>
                              )}
                              {paystackReference && isPaystackModalOpen ? (
                                <PaystackButton
                                  {...paystackConfig}
                                  onSuccess={handlePaystackSuccess}
                                  onClose={handlePaystackClose}
                                  className="w-full"
                                >
                                  <Button
                                    onClick={() => setOpen(false)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 w-full"
                                  >
                                    Continue payment
                                  </Button>
                                </PaystackButton>
                              ) : (
                                <Button
                                  onClick={handleInitializePayment}
                                  disabled={isInitializing}
                                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 "
                                >
                                  {isInitializing ? (
                                    <>
                                      <RefreshCw className="w-5 h-5 animate-spin" />
                                      Initializing...
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownToLine className="w-5 h-5" />
                                      Deposit
                                    </>
                                  )}
                                </Button>
                              )}{" "}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-16 text-lg flex items-center gap-3" onClick={handleWithdraw}>
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
                    {filteredTransactions?.map((transaction) => (
                      <TransactionDetails
                        key={transaction._id}
                        transaction={transaction}
                        user={user}
                        handlePaystackSuccess={handlePaystackSuccess}
                        handlePaystackClose={handlePaystackClose}
                      />
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
