import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  title: string;
  description: string;
  errorCode?: string;
  onReset?: () => void; // Add optional onReset prop
}

const ErrorMessage = ({
  title,
  description,
  errorCode,
  onReset,
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>

      {errorCode && (
        <div className="mb-4">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            Error Code: {errorCode}
          </span>
        </div>
      )}

      <p className="text-gray-500 mb-8 max-w-md leading-normal">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => (window.location.href = "/")}>
          Return to Homepage
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            /* Implement contact logic or link */
          }}
        >
          Contact Support
        </Button>
        {onReset && (
          <Button variant="secondary" onClick={onReset}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
