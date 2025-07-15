"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { PinInput } from "./pin-input";
import { useAuth } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

type AuthStep = "AMOUNT_ENTRY" | "PIN_SETUP" | "PIN_CONFIRMATION" | "PIN_VERIFICATION" | "TRANSFER_COMPLETE";

interface SecurityState {
  pinAttempts: number;
  maxPinAttempts: number;
  isLocked: boolean;
  lockoutTime?: number;
}

interface SecureKeyPadProps {
  sellerId: Id<"users">;
}

export default function SecureKeypad({ sellerId }: SecureKeyPadProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("AMOUNT_ENTRY");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isPinError, setIsPinError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pinExists, setPinExists] = useState<boolean | null>(null);
  const [securityState, setSecurityState] = useState<SecurityState>({
    pinAttempts: 0,
    maxPinAttempts: 3,
    isLocked: false,
  });
  const { getToken } = useAuth();

  // Check if PIN exists when component mounts
  useEffect(() => {
    const checkPinExists = async () => {
      try {
        const token = await getToken({ template: "convex" });
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/pin/check`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPinExists(data.exists);
          if (data.isLocked) {
            setSecurityState(prev => ({
              ...prev,
              isLocked: true,
              lockoutTime: data.lockExpiresAt
            }));
          }
        }
      } catch (error) {
        console.error("Error checking PIN status:", error);
      }
    };

    checkPinExists();
  }, [getToken]);

  const presetAmounts = [
    { label: "₦500.00", value: "500.00" },
    { label: "₦1,000.00", value: "1000.00" },
    { label: "₦2,000.00", value: "2000.00" },
    { label: "₦3,000.00", value: "3000.00" },
    { label: "₦5,000.00", value: "5000.00" },
  ];

  const handleNumberClick = (number: string) => {
    if (amount.length < 10) {
      const newAmount = amount + number;
      setAmount(newAmount);
      setDisplayAmount(formatAmount(newAmount));
    }
  };

  const handlePresetClick = (value: string) => {
    setAmount(value);
    setDisplayAmount(formatAmount(value));
  };

  const handleClear = () => {
    setAmount("");
    setDisplayAmount("");
  };

  const handleBackspace = () => {
    const newAmount = amount.slice(0, -1);
    setAmount(newAmount);
    setDisplayAmount(formatAmount(newAmount));
  };

  const formatAmount = (value: string) => {
    if (!value) return "";
    const num = Number.parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleTransfer = async () => {
    if (amount) {
      // Check if user has a PIN set up
      if (pinExists === false) {
        setCurrentStep("PIN_SETUP");
      } else {
        setCurrentStep("PIN_VERIFICATION");
      }
    }
  };

  const handlePinComplete = useCallback(
    async (enteredPin: string) => {
      if (securityState.isLocked || isLoading) return;

      setIsLoading(true);
      setIsPinError(false);
      setErrorMessage("");

      try {
        const token = await getToken({ template: "convex" });
        if (!token) {
          setErrorMessage("You are not authorized to make this transfer.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/transfer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: parseFloat(amount.replace(/,/g, "")),
              sellerId: sellerId,
              pin: enteredPin,
              productIds: [], // Add productIds if needed
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Transfer successful
          setSecurityState((prev) => ({ ...prev, pinAttempts: 0 }));
          setCurrentStep("TRANSFER_COMPLETE");
        } else {
          // Handle errors from the API
          setIsPinError(true);

          if (data.error.includes("Incorrect PIN")) {
            // Extract remaining attempts from error message
            const match = data.error.match(/(\d+) attempts remaining/);
            const remainingAttempts = match ? parseInt(match[1]) : 0;
            const newAttempts = securityState.maxPinAttempts - remainingAttempts;

            setSecurityState((prev) => ({ ...prev, pinAttempts: newAttempts }));
            setErrorMessage(data.error);
          } else if (data.error.includes("locked")) {
            // Wallet is locked
            setSecurityState((prev) => ({
              ...prev,
              isLocked: true,
              lockoutTime: Date.now() + 300000, // 5 minutes lockout
            }));
            setErrorMessage(data.error);
          } else {
            // Other errors (insufficient funds, etc.)
            setErrorMessage(data.error);
          }
        }
      } catch (error) {
        console.error("Transfer error:", error);
        setErrorMessage("Network error. Please try again.");
        setIsPinError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [securityState, isLoading, amount, sellerId, getToken]
  );

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    if (isPinError && newPin.length === 0) {
      setIsPinError(false);
      setErrorMessage("");
    }
  };

  const validatePin = (pin: string) => {
    if (pin.length !== 6) {
      return "PIN must be exactly 6 digits";
    }
    if (!/^\d+$/.test(pin)) {
      return "PIN must contain only numbers";
    }
    return null;
  };

  const handleCreatePin = async () => {
    if (isLoading) return;

    // Validate PIN
    const pinError = validatePin(newPin);
    if (pinError) {
      setErrorMessage(pinError);
      setIsPinError(true);
      return;
    }

    // Check if PINs match
    if (newPin !== confirmPin) {
      setErrorMessage("PINs do not match. Please try again.");
      setIsPinError(true);
      return;
    }

    setIsLoading(true);
    setIsPinError(false);
    setErrorMessage("");

    try {
      const token = await getToken({ template: "convex" });
      if (!token) {
        setErrorMessage("You are not authorized to create a PIN.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/pin/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pin: newPin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // PIN created successfully, now proceed with transfer
        setPinExists(true);
        setNewPin("");
        setConfirmPin("");
        setCurrentStep("PIN_VERIFICATION");
      } else {
        setIsPinError(true);
        setErrorMessage(data.error || "Failed to create PIN");
      }
    } catch (error) {
      console.error("PIN setup error:", error);
      setErrorMessage("Network error. Please try again.");
      setIsPinError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSetup = useCallback(
    async (newPin: string) => {
      if (isLoading) return;

      setIsLoading(true);
      setIsPinError(false);
      setErrorMessage("");

      try {
        const token = await getToken({ template: "convex" });
        if (!token) {
          setErrorMessage("You are not authorized to create a PIN.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_HTTP_ACTION_URL}/wallet/pin/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              pin: newPin,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // PIN created successfully, now proceed with transfer
          setPinExists(true);
          setCurrentStep("PIN_VERIFICATION");
        } else {
          setIsPinError(true);
          setErrorMessage(data.error || "Failed to create PIN");
        }
      } catch (error) {
        console.error("PIN setup error:", error);
        setErrorMessage("Network error. Please try again.");
        setIsPinError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, getToken]
  );

  const handleBack = () => {
    switch (currentStep) {
      case "PIN_SETUP":
        setCurrentStep("AMOUNT_ENTRY");
        setPin("");
        setIsPinError(false);
        setErrorMessage("");
        break;
      case "PIN_VERIFICATION":
        setCurrentStep("AMOUNT_ENTRY");
        setPin("");
        setIsPinError(false);
        setErrorMessage("");
        break;
      case "TRANSFER_COMPLETE":
        // Reset everything
        setCurrentStep("AMOUNT_ENTRY");
        setAmount("");
        setDisplayAmount("");
        setPin("");
        setIsPinError(false);
        setErrorMessage("");
        setSecurityState({
          pinAttempts: 0,
          maxPinAttempts: 3,
          isLocked: false,
        });
        break;
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-6 pb-4">
      {currentStep !== "AMOUNT_ENTRY" && (
        <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="text-sm text-green-600 font-medium">Secure</span>
      </div>
    </div>
  );

  if (currentStep === "AMOUNT_ENTRY") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {renderHeader()}

        <div className="flex-1 px-6 pb-0">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Amount
            </h1>

            <div className="mb-8">
              <div className="flex items-center text-4xl font-light text-gray-900 mb-2">
                <span className="mr-2">₦</span>
                <span className="min-w-0 flex-1">
                  {displayAmount || "0.00"}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  onClick={() => handlePresetClick(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-2xl text-lg mb-6"
              onClick={handleTransfer}
              disabled={!amount}
            >
              Transfer
            </Button>
          </div>
        </div>

        <div className="bg-gray-200 p-6 pt-8">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  variant="secondary"
                  className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
                  onClick={() => handleNumberClick(number.toString())}
                >
                  {number}
                </Button>
              ))}

              <Button
                variant="secondary"
                className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
                onClick={handleClear}
              >
                Clear
              </Button>

              <Button
                variant="secondary"
                className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
                onClick={() => handleNumberClick("0")}
              >
                0
              </Button>

              <Button
                variant="secondary"
                className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "PIN_SETUP") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {renderHeader()}

        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Create Your PIN
              </h1>
              <p className="text-gray-600 mb-2">
                Set up a secure 6-digit PIN to protect your wallet
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Transfer Amount: <span className="font-semibold">₦{displayAmount}</span>
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPin" className="text-sm font-medium text-gray-700">
                  Create PIN
                </Label>
                <div className="relative">
                  <Input
                    id="newPin"
                    type={showNewPin ? "text" : "password"}
                    value={newPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setNewPin(value);
                      if (isPinError) {
                        setIsPinError(false);
                        setErrorMessage("");
                      }
                    }}
                    placeholder="Enter 6-digit PIN"
                    className="pr-10 text-lg tracking-widest text-center"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowNewPin(!showNewPin)}
                    disabled={isLoading}
                  >
                    {showNewPin ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  PIN must be exactly 6 digits
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-sm font-medium text-gray-700">
                  Confirm PIN
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showConfirmPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setConfirmPin(value);
                      if (isPinError) {
                        setIsPinError(false);
                        setErrorMessage("");
                      }
                    }}
                    placeholder="Re-enter PIN"
                    className="pr-10 text-lg tracking-widest text-center"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    disabled={isLoading}
                  >
                    {showConfirmPin ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Re-enter your PIN to confirm
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Security Tips
                    </h3>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Choose a PIN that's easy for you to remember</li>
                      <li>• Don't use obvious patterns like 123456</li>
                      <li>• Keep your PIN private and secure</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-2xl text-lg disabled:opacity-50"
                onClick={handleCreatePin}
                disabled={!newPin || !confirmPin || newPin.length !== 6 || confirmPin.length !== 6 || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating PIN...
                  </div>
                ) : (
                  "Create PIN & Continue"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "PIN_VERIFICATION") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {renderHeader()}

        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Enter PIN
            </h1>
            <p className="text-gray-600 mb-2">
              Enter your 6-digit PIN to continue
            </p>
            <p className="text-lg font-medium text-gray-900 mb-8">
              ₦{displayAmount}
            </p>

            {errorMessage && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-200 p-6 pt-8">
          <div className="max-w-md mx-auto">
            {isLoading && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-600 text-sm">Processing transfer...</span>
                </div>
              </div>
            )}
            <PinInput
              onPinComplete={handlePinComplete}
              onPinChange={handlePinChange}
              maxLength={6}
              isError={isPinError}
              disabled={securityState.isLocked || isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "TRANSFER_COMPLETE") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Transfer Successful
          </h1>
          <p className="text-gray-600 mb-4">
            Your transfer of ₦{displayAmount} has been processed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">₦{displayAmount}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-2xl text-lg"
            onClick={handleBack}
          >
            Make Another Transfer
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
