'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PinInputProps {
  onPinComplete: (pin: string) => void;
  onPinChange: (pin: string) => void;
  maxLength?: number;
  isError?: boolean;
  disabled?: boolean;
}

export function PinInput({
  onPinComplete,
  onPinChange,
  maxLength = 6,
  isError = false,
  disabled = false,
}: PinInputProps) {
  const [pin, setPin] = useState('');

  const handleNumberClick = (number: string) => {
    if (disabled || pin.length >= maxLength) return;

    const newPin = pin + number;
    setPin(newPin);
    onPinChange(newPin);

    if (newPin.length === maxLength) {
      onPinComplete(newPin);
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    onPinChange(newPin);
  };

  const handleClear = () => {
    if (disabled) return;
    setPin('');
    onPinChange('');
  };

  // Reset pin on error
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setPin('');
        onPinChange('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isError, onPinChange]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* PIN Display */}
      <div className="mb-8 flex max-w-md justify-center">
        <div className="flex gap-3">
          {Array.from({ length: maxLength }).map((_, index) => (
            <div
              className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                index < pin.length
                  ? isError
                    ? 'border-red-500 bg-red-500'
                    : 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              } ${isError ? 'animate-pulse' : ''}`}
              key={index}
            />
          ))}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="w-full bg-gray-200 p-2">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              className="h-16 rounded-2xl border-0 bg-white font-medium text-2xl text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={disabled}
              key={number}
              onClick={() => handleNumberClick(number.toString())}
              variant="secondary"
            >
              {number}
            </Button>
          ))}

          <Button
            className="h-16 rounded-2xl border-0 bg-white font-medium text-gray-900 text-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={disabled}
            onClick={handleClear}
            variant="secondary"
          >
            Clear
          </Button>

          <Button
            className="h-16 rounded-2xl border-0 bg-white font-medium text-2xl text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={disabled}
            onClick={() => handleNumberClick('0')}
            variant="secondary"
          >
            0
          </Button>

          <Button
            className="h-16 rounded-2xl border-0 bg-white font-medium text-gray-900 text-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={disabled}
            onClick={handleBackspace}
            variant="secondary"
          >
            ⌫
          </Button>
        </div>
      </div>
    </div>
  );
}
