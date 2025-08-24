import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

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
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h1 className="font-bold text-2xl md:text-3xl">{title}</h1>
      </div>

      {errorCode && (
        <div className="mb-4">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700 text-sm">
            Error Code: {errorCode}
          </span>
        </div>
      )}

      <p className="mb-8 max-w-md text-gray-500 leading-normal">
        {description}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={() => (window.location.href = '/')}>
          Return to Homepage
        </Button>
        <Button
          onClick={() => {
            /* Implement contact logic or link */
          }}
          variant="outline"
        >
          Contact Support
        </Button>
        {onReset && (
          <Button onClick={onReset} variant="secondary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
