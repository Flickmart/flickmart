"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { SecurityHeader } from "./security-header";

interface PinSetupProps {
  displayAmount: string;
  errorMessage: string;
  isLoading: boolean;
  onBack: () => void;
  onCreatePin: (newPin: string, confirmPin: string) => void;
}

export function PinSetup({
  displayAmount,
  errorMessage,
  isLoading,
  onBack,
  onCreatePin,
}: PinSetupProps) {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleSubmit = () => {
    onCreatePin(newPin, confirmPin);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SecurityHeader showBackButton onBack={onBack} />

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
                  }}
                  placeholder="Enter 6-digit PIN"
                  className="pr-10 text-lg tracking-widest text-center"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowNewPin(!showNewPin)}
                >
                  {showNewPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
                  }}
                  placeholder="Confirm 6-digit PIN"
                  className="pr-10 text-lg tracking-widest text-center"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                >
                  {showConfirmPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              onClick={handleSubmit}
              disabled={isLoading || newPin.length !== 6 || confirmPin.length !== 6}
            >
              {isLoading ? "Creating PIN..." : "Create PIN"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}