"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ClientOnly from "@/components/client-only";
import { WalletPageSkeleton } from "@/components/wallet/skeleton";
import WalletLayout from "@/components/wallet/WalletLayout";
import { api } from "@/convex/_generated/api";
import { type Doc } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [paystackReference, setPaystackReference] = useState<string>("");
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [recipientDetails, setRecipientDetails] = useState<any>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const { user, isLoading: authLoading, isAuthenticated } = useAuthUser();

  // Fetch banks when withdrawal dialog opens
  useEffect(() => {
    if (withdrawOpen) {
      fetchBanks();
    }
  }, [withdrawOpen]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        // Check the actual transaction status
        const transactionStatus = data.data?.status;

        if (transactionStatus === "success") {
          toast.success("Payment successful! Wallet updated.");
          setAmount(0);
          setPaystackReference("");
          setIsPaystackModalOpen(false);
          setError(null);
        } else if (transactionStatus === "abandoned") {
          toast.error("Payment was not completed. Please try again.");
          setError(
            "Payment was abandoned. Please complete the payment process."
          );
          setIsPaystackModalOpen(false);
        } else if (transactionStatus === "failed") {
          toast.error("Payment failed. Please try again.");
          setError("Payment failed. Please try a different payment method.");
          setIsPaystackModalOpen(false);
        } else if (transactionStatus === "pending") {
          toast.info("Payment is still being processed. Please wait.");
          setError("Payment is pending. Please wait for confirmation.");
          setIsPaystackModalOpen(false);
        } else {
          // Handle other statuses
          const userMessage =
            data.userMessage ||
            "Payment status unclear. Please contact support.";
          toast.error(userMessage);
          setError(userMessage);
          setIsPaystackModalOpen(false);
        }
      } else {
        toast.error("We couldn't verify your transaction");
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

  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      setError(null);

      // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Unauthorised user");
        setIsLoadingBanks(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/list-banks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status) {
        setBanks(data.data);
      } else {
        setError("Failed to fetch banks.");
        toast.error("Failed to fetch banks.");
      }
    } catch (err) {
      setError("Error fetching banks.");
      toast.error("Error fetching banks.");
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const verifyAccount = async () => {
    if (!(accountNumber && selectedBank)) {
      setError("Please enter account number and select bank");
      return;
    }

    try {
      setIsVerifyingAccount(true);
      setError(null);

      // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Unauthorised user");
        setIsVerifyingAccount(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/verify-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_number: accountNumber,
            bank_code: selectedBank,
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        setRecipientDetails(data.data);
        setAccountName(data.data.account_name);
        setVerifyDialogOpen(true);
      } else {
        setError(data.message || "Failed to verify account");
        toast.error(data.message || "Failed to verify account");
      }
    } catch (err) {
      setError("Error verifying account");
      toast.error("Error verifying account");
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      setError("Please enter a valid amount.");
      toast.error("Amount invalid");
      return;
    }

    if (!selectedBank) {
      setError("Please select a bank.");
      toast.error("Bank selection required");
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number.");
      toast.error("Invalid account number");
      return;
    }

    if (!user) {
      setError("Log in to withdraw from your wallet.");
      return;
    }

    try {
      setError(null);
      setIsWithdrawing(true);

      // Get the auth token from Clerk
      const token = await getToken({ template: "convex" });
      if (!token) {
        setError("Unauthorised user");
        setIsWithdrawing(false);
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
            amount,
            bankCode: selectedBank,
            accountNumber,
            accountName: accountName || "Not Verified",
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        toast.success("Withdrawal initiated successfully!");
        setAmount(0);
        setSelectedBank("");
        setAccountNumber("");
        setAccountName("");
        setWithdrawOpen(false);
      } else {
        setError(data.message || "Failed to process withdrawal.");
        toast.error(data.message || "Failed to process withdrawal.");
      }
    } catch (err) {
      setError("Error processing withdrawal.");
      toast.error("Error processing withdrawal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isLoadingData =
    authLoading || wallet === undefined || transactions === undefined;

  if (isLoadingData || isLoading) {
    return <WalletPageSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useAuthUser
  }

  return (
    <ClientOnly>
      <WalletLayout
        user={user as Doc<"users">}
        balance={balance}
        showBalance={showBalance}
        isRefreshingBalance={isRefreshingBalance}
        activeTab={activeTab}
        transactions={transactions}
        isLoadingTransactions={isLoadingTransactions}
        open={open}
        withdrawOpen={withdrawOpen}
        amount={amount}
        error={error}
        isInitializing={isInitializing}
        isPaystackModalOpen={isPaystackModalOpen}
        paystackReference={paystackReference}
        banks={banks}
        selectedBank={selectedBank}
        accountNumber={accountNumber}
        accountName={accountName}
        isLoadingBanks={isLoadingBanks}
        isVerifyingAccount={isVerifyingAccount}
        isWithdrawing={isWithdrawing}
        recipientDetails={recipientDetails}
        verifyDialogOpen={verifyDialogOpen}
        onToggleBalance={() => setShowBalance(!showBalance)}
        onRefreshBalance={handleRefreshBalance}
        setActiveTab={setActiveTab}
        handleRefreshTransactions={handleRefreshTransactions}
        setOpen={setOpen}
        setWithdrawOpen={setWithdrawOpen}
        setAmount={setAmount}
        setError={setError}
        setPaystackReference={setPaystackReference}
        setIsPaystackModalOpen={setIsPaystackModalOpen}
        handleInitializePayment={handleInitializePayment}
        handlePaystackSuccess={handlePaystackSuccess}
        handlePaystackClose={handlePaystackClose}
        setSelectedBank={setSelectedBank}
        setAccountNumber={setAccountNumber}
        setAccountName={setAccountName}
        verifyAccount={verifyAccount}
        handleWithdraw={handleWithdraw}
        setVerifyDialogOpen={setVerifyDialogOpen}
      />
    </ClientOnly>
  );
}
