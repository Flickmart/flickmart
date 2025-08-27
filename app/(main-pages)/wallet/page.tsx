'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  Eye,
  EyeOff,
  Headphones,
  RefreshCw,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ClientOnly from '@/components/client-only';
import Loader from '@/components/multipage/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BalanceSkeleton,
  TransactionHistorySkeleton,
  WalletPageSkeleton,
} from '@/components/wallet/skeleton';
import TransactionDetails from '@/components/wallet/transaction-details';
import { api } from '@/convex/_generated/api';
import { type Doc, Id } from '@/convex/_generated/dataModel';
import { useAuthUser } from '@/hooks/useAuthUser';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  {
    ssr: false,
    loading: () => (
      <Button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        disabled
      >
        Loading payment...
      </Button>
    ),
  }
);
interface PaystackConfig {
  email: string;
  amount: number;
  publicKey: string;
  reference: string;
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>('');
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [paystackReference, setPaystackReference] = useState<string>('');
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
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
    user ? { userId: user._id } : 'skip'
  );
  const transactions = useQuery(
    api.transactions.getByUserId,
    user ? { userId: user._id } : 'skip'
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
      setError('Please enter a valid amount.');
      toast.error('Amount invalid');
      return;
    }
    if (!user) {
      setError('Log in to fund your wallet.');
      return;
    }
    try {
      setError(null);
      setIsInitializing(true);
      setIsPaystackModalOpen(true);
      // Get the auth token from Clerk
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('Unauthorised user');
        setIsInitializing(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/initialize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email, amount }),
        }
      );
      const data = await response.json();
      if (data.status) {
        setPaystackReference(data.data.reference);
      } else {
        setError('Failed to initialize payment.');
        toast.error('Failed to initialize payment.');
        setIsPaystackModalOpen(false);
      }
    } catch (err) {
      setError('Error initializing payment.');
      setIsPaystackModalOpen(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePaystackSuccess = async (response: { reference: string }) => {
    console.log(response);
    try {
      // Get the auth token from Clerk
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('User not authenticated.');
        setIsPaystackModalOpen(false);
        return;
      }
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reference: response.reference,
            userId: user?._id,
          }),
        }
      );
      const data = await result.json();
      console.log('Verification response:', data);
      
      if (data.status) {
        // Check the actual transaction status
        const transactionStatus = data.data?.status;
        
        if (transactionStatus === 'success') {
          toast.success('Payment successful! Wallet updated.');
          setAmount(0);
          setPaystackReference('');
          setIsPaystackModalOpen(false);
          setError(null);
        } else if (transactionStatus === 'abandoned') {
          toast.error('Payment was not completed. Please try again.');
          setError('Payment was abandoned. Please complete the payment process.');
          setIsPaystackModalOpen(false);
        } else if (transactionStatus === 'failed') {
          toast.error('Payment failed. Please try again.');
          setError('Payment failed. Please try a different payment method.');
          setIsPaystackModalOpen(false);
        } else if (transactionStatus === 'pending') {
          toast.info('Payment is still being processed. Please wait.');
          setError('Payment is pending. Please wait for confirmation.');
          setIsPaystackModalOpen(false);
        } else {
          // Handle other statuses
          const userMessage = data.userMessage || 'Payment status unclear. Please contact support.';
          toast.error(userMessage);
          setError(userMessage);
          setIsPaystackModalOpen(false);
        }
      } else {
        toast.error("We couldn't verify your transaction");
        setError('Payment verification failed.');
        setIsPaystackModalOpen(false);
      }
    } catch (err) {
      setError('Error verifying payment.');
      setIsPaystackModalOpen(false);
    }
  };

  const handlePaystackClose = () => {
    setError('Payment cancelled.');
    toast.info('Paystack transaction closed');
    setPaystackReference('');
    setIsPaystackModalOpen(false);
  };

  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      setError(null);

      // Get the auth token from Clerk
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('Unauthorised user');
        setIsLoadingBanks(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/list-banks`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status) {
        setBanks(data.data);
      } else {
        setError('Failed to fetch banks.');
        toast.error('Failed to fetch banks.');
      }
    } catch (err) {
      setError('Error fetching banks.');
      toast.error('Error fetching banks.');
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const verifyAccount = async () => {
    if (!(accountNumber && selectedBank)) {
      setError('Please enter account number and select bank');
      return;
    }

    try {
      setIsVerifyingAccount(true);
      setError(null);

      // Get the auth token from Clerk
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('Unauthorised user');
        setIsVerifyingAccount(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/verify-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
        setError(data.message || 'Failed to verify account');
        toast.error(data.message || 'Failed to verify account');
      }
    } catch (err) {
      setError('Error verifying account');
      toast.error('Error verifying account');
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      setError('Please enter a valid amount.');
      toast.error('Amount invalid');
      return;
    }

    if (!selectedBank) {
      setError('Please select a bank.');
      toast.error('Bank selection required');
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      setError('Please enter a valid 10-digit account number.');
      toast.error('Invalid account number');
      return;
    }

    if (!user) {
      setError('Log in to withdraw from your wallet.');
      return;
    }

    try {
      setError(null);
      setIsWithdrawing(true);

      // Get the auth token from Clerk
      const token = await getToken({ template: 'convex' });
      if (!token) {
        setError('Unauthorised user');
        setIsWithdrawing(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/paystack/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            bankCode: selectedBank,
            accountNumber,
            accountName: accountName || 'Not Verified',
          }),
        }
      );

      const data = await response.json();
      if (data.status) {
        toast.success('Withdrawal initiated successfully!');
        setAmount(0);
        setSelectedBank('');
        setAccountNumber('');
        setAccountName('');
        setWithdrawOpen(false);
      } else {
        setError(data.message || 'Failed to process withdrawal.');
        toast.error(data.message || 'Failed to process withdrawal.');
      }
    } catch (err) {
      setError('Error processing withdrawal.');
      toast.error('Error processing withdrawal.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const paystackConfig: PaystackConfig = {
    email: user?.email ?? '',
    amount: amount * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    reference: paystackReference,
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits')
      return (
        transaction.type === 'funding' ||
        transaction.type === 'transfer_in' ||
        transaction.type === 'escrow_refund'
      );
    if (activeTab === 'withdrawals') return transaction.type === 'withdrawal';
    return true;
  });

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
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Card className="rounded-none border-0 shadow-none">
            {/* Header */}
            <CardHeader className="bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage alt={user?.name} src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-lg">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">
                      Welcome, let's make payment
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Headphones className="h-6 w-6 text-gray-600" />
                  <div className="-top-1 -right-1 absolute flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-xs">
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
                <div className="bg-orange-500 p-6 text-white">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <span className="text-sm opacity-90">Wallet balance</span>
                      <Button
                        className="h-auto p-1 text-white hover:bg-orange-600"
                        onClick={() => setShowBalance(!showBalance)}
                        size="sm"
                        variant="ghost"
                      >
                        {showBalance ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        className="ml-2 h-auto p-1 text-white hover:bg-orange-600"
                        onClick={handleRefreshBalance}
                        size="sm"
                        variant="ghost"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mb-6 font-bold text-3xl">
                      {showBalance
                        ? `₦${balance.toLocaleString()}.00`
                        : '₦••••••••'}
                    </div>

                    {/* Action Buttons */}
                    <div className="mx-4 rounded-2xl bg-white p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Dialog onOpenChange={setOpen} open={open}>
                          <form>
                            <DialogTrigger asChild>
                              <Button className="flex h-12 items-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
                                <ArrowDownToLine className="h-5 w-5" />
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
                                            setPaystackReference('');
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
                                  <p className="mb-2 text-red-500 text-sm">
                                    {error}
                                  </p>
                                )}
                                {paystackReference && isPaystackModalOpen ? (
                                  <PaystackButton
                                    {...paystackConfig}
                                    className="w-full"
                                    onClose={handlePaystackClose}
                                    onSuccess={handlePaystackSuccess}
                                  >
                                    <Button
                                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                                      onClick={() => setOpen(false)}
                                    >
                                      Deposit
                                    </Button>
                                  </PaystackButton>
                                ) : (
                                  <Button
                                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                                    disabled={isInitializing}
                                    onClick={handleInitializePayment}
                                  >
                                    {isInitializing ? (
                                      <>
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        Initializing...
                                      </>
                                    ) : (
                                      <>
                                        <ArrowDownToLine className="h-5 w-5" />
                                        Deposit
                                      </>
                                    )}
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </form>
                        </Dialog>

                        <Dialog
                          onOpenChange={setWithdrawOpen}
                          open={withdrawOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="flex h-12 items-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
                              <ArrowUpFromLine className="h-5 w-5" />
                              Withdraw
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Withdraw money</DialogTitle>
                              <DialogDescription>
                                Withdraw money from your wallet to your bank
                                account.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="withdraw-amount">Amount</Label>
                                <Input
                                  id="withdraw-amount"
                                  name="withdraw-amount"
                                  onChange={(e) => {
                                    setAmount(Number(e.target.value));
                                  }}
                                  type="number"
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="bank-select">Select Bank</Label>
                                {isLoadingBanks ? (
                                  <div className="flex items-center justify-center p-2">
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    <span className="ml-2">
                                      Loading banks...
                                    </span>
                                  </div>
                                ) : (
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    id="bank-select"
                                    onChange={(e) =>
                                      setSelectedBank(e.target.value)
                                    }
                                    value={selectedBank}
                                  >
                                    <option value="">Select a bank</option>
                                    {banks.map((bank) => (
                                      <option
                                        key={bank.code + bank.name}
                                        value={bank.code}
                                      >
                                        {bank.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="account-number">
                                  Account Number
                                </Label>
                                <Input
                                  id="account-number"
                                  maxLength={10}
                                  name="account-number"
                                  onChange={(e) => {
                                    setAccountNumber(
                                      e.target.value.replace(/\D/g, '')
                                    );
                                  }}
                                  placeholder="Enter 10-digit account number"
                                  type="text"
                                  value={accountNumber}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              {error && (
                                <p className="mb-2 text-red-500 text-sm">
                                  {error}
                                </p>
                              )}
                              <Button
                                className="flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                                disabled={isVerifyingAccount}
                                onClick={verifyAccount}
                              >
                                {isVerifyingAccount ? (
                                  <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpFromLine className="h-5 w-5" />
                                    Verify Account
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
                  <h3 className="mb-1 font-bold text-xl">
                    Transaction History
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your recent financial activities
                  </p>
                </div>
                <Button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={handleRefreshTransactions}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Custom Tab Navigation */}
              <div className="mb-4">
                <div className="flex gap-6">
                  <button
                    className={`relative p-2 py-[2px] font-medium text-sm transition-colors ${
                      activeTab === 'all'
                        ? 'text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    {activeTab === 'all' && (
                      <div className="-m-1 absolute inset-0 rounded-full bg-orange-100" />
                    )}
                    <span className="relative">All</span>
                  </button>
                  <button
                    className={`relative p-2 py-[2px] font-medium transition-colors ${
                      activeTab === 'deposits'
                        ? 'text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('deposits')}
                  >
                    {activeTab === 'deposits' && (
                      <div className="-m-1 absolute inset-0 rounded-full bg-orange-100" />
                    )}
                    <span className="relative">Deposits</span>
                  </button>
                  <button
                    className={`relative p-2 py-[2px] font-medium text-sm transition-colors ${
                      activeTab === 'withdrawals'
                        ? 'text-orange-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('withdrawals')}
                  >
                    {activeTab === 'withdrawals' && (
                      <div className="-m-1 absolute inset-0 rounded-full bg-orange-100" />
                    )}
                    <span className="relative">Withdrawals</span>
                    {activeTab === 'withdrawals' && (
                      <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-500" />
                    )}
                  </button>
                </div>
              </div>
              {filteredTransactions?.length === 0 && (
                <span>No transactional activities </span>
              )}
              {/* Transaction Content */}
              <div className="space-y-3">
                {filteredTransactions?.map((transaction) => (
                  <TransactionDetails
                    handlePaystackClose={handlePaystackClose}
                    handlePaystackSuccess={handlePaystackSuccess}
                    key={transaction._id}
                    transaction={transaction}
                    user={user as Doc<'users'>}
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
              <CardHeader className="border-b bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage alt={user?.name} src={user?.imageUrl} />
                      <AvatarFallback>
                        {user?.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-lg">{user?.name}</h2>
                      <p className="text-gray-500 text-sm">
                        Welcome, let's make payment
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <Bell className="h-7 w-7 text-gray-600" />
                    <div className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
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
                  <div className="bg-orange-500 p-8 text-white">
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-3">
                        <span className="text-lg opacity-90">
                          Wallet balance
                        </span>
                        <Button
                          className="h-auto p-2 text-white hover:bg-orange-600"
                          onClick={() => setShowBalance(!showBalance)}
                          size="sm"
                          variant="ghost"
                        >
                          {showBalance ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          className="h-auto p-2 text-white hover:bg-orange-600"
                          onClick={handleRefreshBalance}
                          size="sm"
                          variant="ghost"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="mb-8 font-bold text-5xl">
                        {showBalance
                          ? `₦${balance.toLocaleString()}.00`
                          : '₦••••••••'}
                      </div>

                      {/* Action Buttons */}
                      <div className="mx-8 rounded-3xl bg-white p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <Dialog onOpenChange={setOpen} open={open}>
                            <DialogTrigger asChild>
                              <Button className="flex h-16 items-center gap-3 rounded-full bg-orange-500 text-lg text-white hover:bg-orange-600">
                                <ArrowDownToLine className="h-6 w-6" />
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
                                            setPaystackReference('');
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
                                  <p className="mb-2 text-red-500 text-sm">
                                    {error}
                                  </p>
                                )}
                                {paystackReference && isPaystackModalOpen ? (
                                  <PaystackButton
                                    {...paystackConfig}
                                    className="w-full"
                                    onClose={handlePaystackClose}
                                    onSuccess={handlePaystackSuccess}
                                  >
                                    <Button
                                      className="flex w-full items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
                                      onClick={() => setOpen(false)}
                                    >
                                      Continue payment
                                    </Button>
                                  </PaystackButton>
                                ) : (
                                  <Button
                                    className="flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                                    disabled={isInitializing}
                                    onClick={handleInitializePayment}
                                  >
                                    {isInitializing ? (
                                      <>
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        Initializing...
                                      </>
                                    ) : (
                                      <>
                                        <ArrowDownToLine className="h-5 w-5" />
                                        Deposit
                                      </>
                                    )}
                                  </Button>
                                )}{' '}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            onOpenChange={setWithdrawOpen}
                            open={withdrawOpen}
                          >
                            <DialogTrigger asChild>
                              <Button className="flex h-16 items-center gap-3 rounded-full bg-orange-500 text-lg text-white hover:bg-orange-600">
                                <ArrowUpFromLine className="h-6 w-6" />
                                Withdraw
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Withdraw money</DialogTitle>
                                <DialogDescription>
                                  Withdraw money from your wallet to your bank
                                  account.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="withdraw-amount-desktop">
                                    Amount
                                  </Label>
                                  <Input
                                    id="withdraw-amount-desktop"
                                    name="withdraw-amount-desktop"
                                    onChange={(e) => {
                                      setAmount(Number(e.target.value));
                                    }}
                                    type="number"
                                  />
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="bank-select-desktop">
                                    Select Bank
                                  </Label>
                                  {isLoadingBanks ? (
                                    <div className="flex items-center justify-center p-2">
                                      <RefreshCw className="h-5 w-5 animate-spin" />
                                      <span className="ml-2">
                                        Loading banks...
                                      </span>
                                    </div>
                                  ) : (
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      id="bank-select-desktop"
                                      onChange={(e) =>
                                        setSelectedBank(e.target.value)
                                      }
                                      value={selectedBank}
                                    >
                                      <option value="">Select a bank</option>
                                      {banks.map((bank) => (
                                        <option
                                          key={bank.code + bank.name}
                                          value={bank.code}
                                        >
                                          {bank.name}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                                <div className="grid gap-3">
                                  <Label htmlFor="account-number-desktop">
                                    Account Number
                                  </Label>
                                  <Input
                                    id="account-number-desktop"
                                    maxLength={10}
                                    name="account-number-desktop"
                                    onChange={(e) => {
                                      setAccountNumber(
                                        e.target.value.replace(/\D/g, '')
                                      );
                                    }}
                                    placeholder="Enter 10-digit account number"
                                    type="text"
                                    value={accountNumber}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                {error && (
                                  <p className="mb-2 text-red-500 text-sm">
                                    {error}
                                  </p>
                                )}
                                <Button
                                  className="flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                                  disabled={isVerifyingAccount}
                                  onClick={verifyAccount}
                                >
                                  {isVerifyingAccount ? (
                                    <>
                                      <RefreshCw className="h-5 w-5 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    <>
                                      <ArrowUpFromLine className="h-5 w-5" />
                                      Verify Account
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
                        <h3 className="mb-2 font-bold text-2xl">
                          Transaction History
                        </h3>
                        <p className="text-gray-500">
                          Your recent financial activities
                        </p>
                      </div>
                      <Button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={handleRefreshTransactions}
                        size="sm"
                        variant="ghost"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Custom Tab Navigation */}
                    <div className="mb-6">
                      <div className="flex items-center justify-around">
                        <button
                          className={`relative pb-3 font-medium text-base transition-colors ${
                            activeTab === 'all'
                              ? 'text-orange-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('all')}
                        >
                          {activeTab === 'all' && (
                            <div className="-m-2 absolute inset-0 rounded-full px-5 py-2" />
                          )}
                          <span className="relative">All</span>
                          {activeTab === 'all' && (
                            <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-500" />
                          )}
                        </button>
                        <button
                          className={`relative pb-3 font-medium text-base transition-colors ${
                            activeTab === 'deposits'
                              ? 'text-orange-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('deposits')}
                        >
                          {activeTab === 'deposits' && (
                            <div className="-m-2 absolute inset-0 rounded-full px-5 py-2" />
                          )}
                          <span className="relative">Deposits</span>
                          {activeTab === 'deposits' && (
                            <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-500" />
                          )}
                        </button>
                        <button
                          className={`relative pb-3 font-medium text-base transition-colors ${
                            activeTab === 'withdrawals'
                              ? 'text-orange-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setActiveTab('withdrawals')}
                        >
                          {activeTab === 'withdrawals' && (
                            <div className="-m-2 absolute inset-0 rounded-full px-5 py-2" />
                          )}
                          <span className="relative">Withdrawals</span>
                          {activeTab === 'withdrawals' && (
                            <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Transaction Content */}
                    <div className="space-y-4">
                      {filteredTransactions?.map((transaction) => (
                        <TransactionDetails
                          handlePaystackClose={handlePaystackClose}
                          handlePaystackSuccess={handlePaystackSuccess}
                          key={transaction._id}
                          transaction={transaction}
                          user={user as Doc<'users'>}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add the verification dialog */}
        <Dialog onOpenChange={setVerifyDialogOpen} open={verifyDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Recipient Details</DialogTitle>
              <DialogDescription>
                Please verify the recipient details before proceeding with the
                withdrawal.
              </DialogDescription>
            </DialogHeader>
            {recipientDetails && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Bank Name</Label>
                  <div className="rounded-md bg-gray-50 p-2">
                    {banks.find((bank) => bank.code === selectedBank)?.name}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Account Name</Label>
                  <div className="rounded-md bg-gray-50 p-2">
                    {recipientDetails.account_name}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Account Number</Label>
                  <div className="rounded-md bg-gray-50 p-2">
                    {accountNumber}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={() => setVerifyDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
                disabled={isWithdrawing}
                onClick={handleWithdraw}
              >
                {isWithdrawing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="h-5 w-5" />
                    Confirm Withdrawal
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientOnly>
  );
}
