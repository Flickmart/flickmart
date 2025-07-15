"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { PinInput } from "./pin-input";
import { useAuth } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

type AuthStep = "AMOUNT_ENTRY" | "PIN_VERIFICATION" | "TRANSFER_COMPLETE";

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
  const [isPinError, setIsPinError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [securityState, setSecurityState] = useState<SecurityState>({
    pinAttempts: 0,
    maxPinAttempts: 3,
    isLocked: false,
  });
  const { getToken } = useAuth();

  // Simulated stored PIN (in real app, this would be securely hashed)
  const STORED_PIN = "123456";

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
    const token = await getToken({ template: "convex" });
    if (!token) {
      setErrorMessage("You are not authroized to make this transfer.");
      return;
    }
    if (amount) {
      setCurrentStep("PIN_VERIFICATION");
      console.log(amount);
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
        }),
      }
    );
  };

  const handlePinComplete = useCallback(
    (enteredPin: string) => {
      if (securityState.isLocked) return;

      if (enteredPin === STORED_PIN) {
        setIsPinError(false);
        setErrorMessage("");
        setSecurityState((prev) => ({ ...prev, pinAttempts: 0 }));
        setCurrentStep("TRANSFER_COMPLETE");
      } else {
        setIsPinError(true);
        const newAttempts = securityState.pinAttempts + 1;

        if (newAttempts >= securityState.maxPinAttempts) {
          setSecurityState((prev) => ({
            ...prev,
            pinAttempts: newAttempts,
            isLocked: true,
            lockoutTime: Date.now() + 300000, // 5 minutes lockout
          }));
          setErrorMessage(
            "Too many failed attempts. Account locked for 5 minutes."
          );
        } else {
          setSecurityState((prev) => ({ ...prev, pinAttempts: newAttempts }));
          setErrorMessage(
            `Incorrect PIN. ${securityState.maxPinAttempts - newAttempts} attempts remaining.`
          );
        }
      }
    },
    [securityState, STORED_PIN]
  );

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    if (isPinError && newPin.length === 0) {
      setIsPinError(false);
      setErrorMessage("");
    }
  };

  const handleBack = () => {
    switch (currentStep) {
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
            <PinInput
              onPinComplete={handlePinComplete}
              onPinChange={handlePinChange}
              maxLength={6}
              isError={isPinError}
              disabled={securityState.isLocked}
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
