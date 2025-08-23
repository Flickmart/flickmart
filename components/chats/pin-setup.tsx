'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SecurityHeader } from './security-header';

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
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleSubmit = () => {
    onCreatePin(newPin, confirmPin);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SecurityHeader onBack={onBack} showBackButton />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl text-gray-900">
              Create Your PIN
            </h1>
            <p className="mb-2 text-gray-600">
              Set up a secure 6-digit PIN to protect your wallet
            </p>
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-blue-800 text-sm">
                Transfer Amount:{' '}
                <span className="font-semibold">₦{displayAmount}</span>
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                className="font-medium text-gray-700 text-sm"
                htmlFor="newPin"
              >
                Create PIN
              </Label>
              <div className="relative">
                <Input
                  className="pr-10 text-center text-lg tracking-widest"
                  id="newPin"
                  maxLength={6}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewPin(value);
                  }}
                  placeholder="Enter 6-digit PIN"
                  type={showNewPin ? 'text' : 'password'}
                  value={newPin}
                />
                <Button
                  className="-translate-y-1/2 absolute top-1/2 right-2 h-8 w-8 transform p-0"
                  onClick={() => setShowNewPin(!showNewPin)}
                  size="sm"
                  type="button"
                  variant="ghost"
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
              <Label
                className="font-medium text-gray-700 text-sm"
                htmlFor="confirmPin"
              >
                Confirm PIN
              </Label>
              <div className="relative">
                <Input
                  className="pr-10 text-center text-lg tracking-widest"
                  id="confirmPin"
                  maxLength={6}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setConfirmPin(value);
                  }}
                  placeholder="Confirm 6-digit PIN"
                  type={showConfirmPin ? 'text' : 'password'}
                  value={confirmPin}
                />
                <Button
                  className="-translate-y-1/2 absolute top-1/2 right-2 h-8 w-8 transform p-0"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  size="sm"
                  type="button"
                  variant="ghost"
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
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
              disabled={
                isLoading || newPin.length !== 6 || confirmPin.length !== 6
              }
              onClick={handleSubmit}
            >
              {isLoading ? 'Creating PIN...' : 'Create PIN'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
