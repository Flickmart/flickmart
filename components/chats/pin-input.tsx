"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface PinInputProps {
  onPinComplete: (pin: string) => void
  onPinChange: (pin: string) => void
  maxLength?: number
  isError?: boolean
  disabled?: boolean
}

export function PinInput({
  onPinComplete,
  onPinChange,
  maxLength = 6,
  isError = false,
  disabled = false,
}: PinInputProps) {
  const [pin, setPin] = useState("")

  const handleNumberClick = (number: string) => {
    if (disabled || pin.length >= maxLength) return

    const newPin = pin + number
    setPin(newPin)
    onPinChange(newPin)

    if (newPin.length === maxLength) {
      onPinComplete(newPin)
    }
  }

  const handleBackspace = () => {
    if (disabled) return
    const newPin = pin.slice(0, -1)
    setPin(newPin)
    onPinChange(newPin)
  }

  const handleClear = () => {
    if (disabled) return
    setPin("")
    onPinChange("")
  }

  // Reset pin on error
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setPin("")
        onPinChange("")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isError, onPinChange])

  return (
    <div className="w-full">
      {/* PIN Display */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-3">
          {Array.from({ length: maxLength }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                index < pin.length
                  ? isError
                    ? "bg-red-500 border-red-500"
                    : "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              } ${isError ? "animate-pulse" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="secondary"
            className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm disabled:opacity-50"
            onClick={() => handleNumberClick(number.toString())}
            disabled={disabled}
          >
            {number}
          </Button>
        ))}

        <Button
          variant="secondary"
          className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm disabled:opacity-50"
          onClick={handleClear}
          disabled={disabled}
        >
          Clear
        </Button>

        <Button
          variant="secondary"
          className="h-16 text-2xl font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm disabled:opacity-50"
          onClick={() => handleNumberClick("0")}
          disabled={disabled}
        >
          0
        </Button>

        <Button
          variant="secondary"
          className="h-16 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 rounded-2xl border-0 shadow-sm disabled:opacity-50"
          onClick={handleBackspace}
          disabled={disabled}
        >
          ⌫
        </Button>
      </div>
    </div>
  )
}


