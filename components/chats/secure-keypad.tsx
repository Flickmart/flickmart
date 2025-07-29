"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductSelectionScreen from "../wallet/product-selection-screen";
import { toast } from "sonner";
import { AmountEntry } from "./amount-entry";
import { PinSetup } from "./pin-setup";
import { PinVerification } from "./pin-verification";
import { TransferComplete } from "./transfer-complete";
import { AmountConfirmation } from "./amount-confirmation";
import { SecurityHeader } from "./security-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

type AuthStep = "AMOUNT_ENTRY" | "PRODUCT_SELECTION" | "AMOUNT_CONFIRMATION" | "PIN_SETUP" | "PIN_CONFIRMATION" | "PIN_VERIFICATION" | "TRANSFER_COMPLETE";

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
  const [isLoading, setIsLoading] = useState(false);
  const [pinExists, setPinExists] = useState<boolean | null>(null);
  const [securityState, setSecurityState] = useState<SecurityState>({
    pinAttempts: 0,
    maxPinAttempts: 5,
    isLocked: false,
  });

  // Product selection state
  const [selectedProducts, setSelectedProducts] = useState<Id<"product">[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Doc<"product">[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSelectionError, setProductSelectionError] = useState("");
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [originalAmount, setOriginalAmount] = useState("");
  const [isValidatingProducts, setIsValidatingProducts] = useState(false);

  const { getToken } = useAuth();

  // Fetch seller's products using the existing getByUserId query
  const seller = useQuery(api.users.getUserById, { userId: sellerId })
  const sellerProductsQuery = useQuery(api.product.getByUserId, { userId: sellerId });
  const isProductsLoading = sellerProductsQuery === undefined;

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
        toast.error("Connection Error", {
          description: "Unable to verify PIN status. Please check your connection and try again."
        });
      }
    };

    checkPinExists();
  }, [getToken]);
  const retryProductFetch = useCallback(() => {
    setProductSelectionError("");
    setIsLoadingProducts(true);
    setSellerProducts([]);

    // Force a re-render to trigger the useQuery hook to retry
    // This is a more robust approach to handle retry scenarios
    setTimeout(() => {
      if (sellerProductsQuery === null) {
        // If still failing after retry, provide fallback options
        setProductSelectionError("Unable to load products after retry. You can continue with a general transfer or try again later.");
      }
    }, 3000); // Give 3 seconds for the retry to complete
  }, [sellerProductsQuery]);

  // Handle product loading states and errors
  useEffect(() => {
    if (isProductsLoading) {
      setIsLoadingProducts(true);
      setProductSelectionError("");
    } else {
      setIsLoadingProducts(false);

      // Handle product loading errors
      if (sellerProductsQuery === null) {
        const errorMessage = "Failed to load seller's products. This could be due to a network issue or server error.";
        setProductSelectionError(errorMessage);
        setSellerProducts([]);
        toast.error("Product Loading Failed", {
          description: errorMessage,
          action: {
            label: "Retry",
            onClick: () => retryProductFetch()
          }
        });
      } else if (sellerProductsQuery && sellerProductsQuery.length === 0) {
        // No products available - this is not an error, just empty state
        setProductSelectionError("");
        setSellerProducts([]);
        toast.info("No Products Available", {
          description: "This seller doesn't have any products listed yet. You can continue with a general transfer."
        });
      } else if (sellerProductsQuery) {
        // Products loaded successfully
        setProductSelectionError("");
        setSellerProducts(sellerProductsQuery);
        if (sellerProductsQuery.length > 0) {
          toast.success("Products Loaded", {
            description: `Found ${sellerProductsQuery.length} product${sellerProductsQuery.length !== 1 ? 's' : ''} from this seller.`
          });
        }
      }
    }
  }, [sellerProductsQuery, isProductsLoading, retryProductFetch]);


  // Calculate total when selected products change
  useEffect(() => {
    if (selectedProducts.length > 0 && sellerProducts.length > 0) {
      const total = selectedProducts.reduce((sum, productId) => {
        const product = sellerProducts.find(p => p._id === productId);
        return sum + (product?.price || 0);
      }, 0);
      setCalculatedTotal(total);
      // Update the display amount to show calculated total
      setAmount(total.toString());
      setDisplayAmount(formatAmount(total.toString()));
    } else if (selectedProducts.length === 0) {
      // Reset to original amount when no products selected
      setCalculatedTotal(0);
    }
  }, [selectedProducts, sellerProducts]);

  // Handle product toggle functionality
  const handleProductToggle = useCallback((productId: Id<"product">) => {
    setSelectedProducts(prev => {
      // Check if product is already selected
      const isCurrentlySelected = prev.includes(productId);

      if (isCurrentlySelected) {
        // Remove product from selection
        return prev.filter(id => id !== productId);
      } else {
        // Add product to selection
        return [...prev, productId];
      }
    });
  }, []);


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
      // Store the original amount before navigating to product selection
      setOriginalAmount(amount);
      setCurrentStep("PRODUCT_SELECTION");
    }
  };

  // Client-side product validation function
  const validateSelectedProducts = useCallback(() => {
    if (selectedProducts.length === 0) {
      return { isValid: true, error: null }; // Empty selection is valid (general transfer)
    }

    // Check if all selected products still exist in the seller's products
    const invalidProducts = selectedProducts.filter(productId => {
      const product = sellerProducts.find(p => p._id === productId);
      if (!product) {
        return true; // Product no longer exists
      }
      if (product.userId !== sellerId) {
        return true; // Product doesn't belong to seller
      }
      return false;
    });

    if (invalidProducts.length > 0) {
      return {
        isValid: false,
        error: "Some selected products are no longer available or have been removed. Please refresh your selection."
      };
    }

    // Validate that the calculated total matches current product prices
    const currentTotal = selectedProducts.reduce((sum, productId) => {
      const product = sellerProducts.find(p => p._id === productId);
      return sum + (product?.price || 0);
    }, 0);

    if (currentTotal !== calculatedTotal && calculatedTotal > 0) {
      return {
        isValid: false,
        error: "Product prices have changed. Please review your selection and try again."
      };
    }

    return { isValid: true, error: null };
  }, [selectedProducts, sellerProducts, sellerId, calculatedTotal]);

  const handlePinComplete = useCallback(
    async (enteredPin: string) => {
      if (securityState.isLocked || isLoading) return;

      setIsLoading(true);
      setIsPinError(false);
      setErrorMessage("");

      try {
        // Perform client-side validation before making the API call
        const validation = validateSelectedProducts();
        if (!validation.isValid) {
          setErrorMessage(validation.error || "Product validation failed");
          setIsPinError(true);
          setIsLoading(false);
          return;
        }

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
              productIds: selectedProducts, // Pass selected product IDs
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Transfer successful
          setSecurityState((prev) => ({ ...prev, pinAttempts: 0 }));
          toast.success("Transfer Successful", {
            description: `Successfully transferred ₦${formatAmount(amount)} to the seller.`
          });
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
            toast.error("Incorrect PIN", {
              description: `${data.error}. Please try again.`
            });
          } else if (data.error.includes("locked")) {
            // Wallet is locked
            setSecurityState((prev) => ({
              ...prev,
              isLocked: true,
              lockoutTime: Date.now() + 300000, // 5 minutes lockout
            }));
            setErrorMessage(data.error);
            toast.error("Wallet Locked", {
              description: "Your wallet has been locked due to too many failed PIN attempts. Please try again later."
            });
          } else if (data.error.includes("invalid") || data.error.includes("do not belong")) {
            // Product validation errors from server
            setErrorMessage("Selected products are invalid. Please refresh and try again.");
            toast.error("Product Validation Failed", {
              description: "Selected products are no longer valid. Returning to product selection."
            });
            // Navigate back to product selection to refresh
            setCurrentStep("PRODUCT_SELECTION");
          } else if (data.error.includes("insufficient")) {
            // Insufficient funds
            setErrorMessage(data.error);
            toast.error("Insufficient Funds", {
              description: "You don't have enough balance to complete this transfer."
            });
          } else {
            // Other errors
            setErrorMessage(data.error);
            toast.error("Transfer Failed", {
              description: data.error || "An unexpected error occurred during the transfer."
            });
          }
        }
      } catch (error) {
        console.error("Transfer error:", error);
        setErrorMessage("Network error. Please try again.");
        setIsPinError(true);
        toast.error("Network Error", {
          description: "Unable to connect to the server. Please check your internet connection and try again."
        });
      } finally {
        setIsLoading(false);
      }
    },
    [securityState, isLoading, amount, sellerId, getToken, validateSelectedProducts, selectedProducts]
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

  const handleCreatePin = async (newPin: string, confirmPin: string) => {
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
        toast.success("PIN Created Successfully", {
          description: "Your wallet PIN has been set up. You can now proceed with the transfer."
        });
        setCurrentStep("PIN_VERIFICATION");
      } else {
        setIsPinError(true);
        setErrorMessage(data.error || "Failed to create PIN");
        toast.error("PIN Creation Failed", {
          description: data.error || "Unable to create your wallet PIN. Please try again."
        });
      }
    } catch (error) {
      console.error("PIN setup error:", error);
      setErrorMessage("Network error. Please try again.");
      setIsPinError(true);
      toast.error("Network Error", {
        description: "Unable to connect to the server. Please check your internet connection and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleBack = () => {
    switch (currentStep) {
      case "PRODUCT_SELECTION":
        // Navigate back to amount entry
        setCurrentStep("AMOUNT_ENTRY");

        // Clear product selections when navigating back to amount entry
        setSelectedProducts([]);
        setCalculatedTotal(0);
        setProductSelectionError("");
        setIsLoadingProducts(false);
        setIsValidatingProducts(false);

        // Preserve seller ID (maintained via props) and restore original amount
        if (originalAmount) {
          setAmount(originalAmount);
          setDisplayAmount(formatAmount(originalAmount));
        }
        break;

      case "AMOUNT_CONFIRMATION":
        // Navigate back to product selection from amount confirmation
        setCurrentStep("PRODUCT_SELECTION");
        break;

      case "PIN_SETUP":
        // Navigate back to amount confirmation from PIN setup
        setCurrentStep("AMOUNT_CONFIRMATION");
        setPin("");
        setIsPinError(false);
        setErrorMessage("");
        break;

      case "PIN_VERIFICATION":
        // Navigate back to amount confirmation from PIN verification
        setCurrentStep("AMOUNT_CONFIRMATION");
        setPin("");
        setIsPinError(false);
        setErrorMessage("");
        break;

      case "TRANSFER_COMPLETE":
        // Reset everything and return to amount entry
        setCurrentStep("AMOUNT_ENTRY");
        setAmount("");
        setDisplayAmount("");
        setPin("");
        setSelectedProducts([]);
        setCalculatedTotal(0);
        setOriginalAmount("");
        setIsPinError(false);
        setErrorMessage("");
        setProductSelectionError("");
        setIsLoadingProducts(false);
        setIsValidatingProducts(false);
        setSecurityState({
          pinAttempts: 0,
          maxPinAttempts: 5,
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
      <AmountEntry
        amount={amount}
        displayAmount={displayAmount}
        onNumberClick={handleNumberClick}
        onPresetClick={handlePresetClick}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onTransfer={handleTransfer}
        seller={seller ? seller : undefined}
      />
    );
  }

  if (currentStep === "PRODUCT_SELECTION") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {renderHeader()}
        <ProductSelectionScreen
          products={sellerProducts}
          selectedProducts={selectedProducts}
          onProductToggle={handleProductToggle}
          onSkip={() => {
            // Skip product selection and proceed to PIN verification
            setSelectedProducts([]);
            setCalculatedTotal(0);
            // Restore original amount when skipping
            if (originalAmount) {
              setAmount(originalAmount);
              setDisplayAmount(formatAmount(originalAmount));
            }
            if (pinExists === false) {
              setCurrentStep("PIN_SETUP");
            } else {
              setCurrentStep("PIN_VERIFICATION");
            }
          }}
          onContinue={async () => {
            // Show validation loading state
            setIsValidatingProducts(true);
            setProductSelectionError("");

            try {
              // Add a small delay to show loading feedback
              await new Promise(resolve => setTimeout(resolve, 500));

              // Validate products before continuing
              const validation = validateSelectedProducts();
              if (!validation.isValid) {
                setProductSelectionError(validation.error || "Product validation failed");
                return;
              }

              // Continue to amount confirmation step when products are selected
              setCurrentStep("AMOUNT_CONFIRMATION");
            } finally {
              setIsValidatingProducts(false);
            }
          }}
          calculatedTotal={calculatedTotal}
          isLoading={isLoadingProducts}
          error={productSelectionError}
          onRetry={retryProductFetch}
          loadingMessage={isLoadingProducts ? "Loading seller's products..." : "Fetching product details..."}
          errorType={productSelectionError?.includes('network') ? 'network' :
            productSelectionError?.includes('server') ? 'server' :
              productSelectionError?.includes('authorized') ? 'auth' : 'generic'}
          isValidating={isValidatingProducts}
        />
      </div>
    );
  }

  if (currentStep === "AMOUNT_CONFIRMATION") {
    return (
      <AmountConfirmation
        initialAmount={originalAmount}
        selectedProductsCount={selectedProducts.length}
        calculatedTotal={calculatedTotal}
        onBack={handleBack}
        onSelectInitialAmount={() => {
          // User chooses to use their initial amount
          setAmount(originalAmount);
          setDisplayAmount(formatAmount(originalAmount));
          // Clear selected products since we're using manual amount
          setSelectedProducts([]);
          setCalculatedTotal(0);
          // Proceed to PIN verification
          if (pinExists === false) {
            setCurrentStep("PIN_SETUP");
          } else {
            setCurrentStep("PIN_VERIFICATION");
          }
        }}
        onSelectProductTotal={() => {
          // User chooses to use the calculated product total
          setAmount(calculatedTotal.toString());
          setDisplayAmount(formatAmount(calculatedTotal.toString()));
          // Keep selected products for the transfer
          // Proceed to PIN verification
          if (pinExists === false) {
            setCurrentStep("PIN_SETUP");
          } else {
            setCurrentStep("PIN_VERIFICATION");
          }
        }}
      />
    );
  }

  if (currentStep === "PIN_SETUP") {
    return (
      <PinSetup
        displayAmount={displayAmount}
        errorMessage={errorMessage}
        isLoading={isLoading}
        onBack={handleBack}
        onCreatePin={handleCreatePin}
      />
    );
  }

  if (currentStep === "PIN_VERIFICATION") {
    return (
      <PinVerification
        displayAmount={displayAmount}
        selectedProductsCount={selectedProducts.length}
        calculatedTotal={calculatedTotal}
        pin={pin}
        isPinError={isPinError}
        errorMessage={errorMessage}
        isLoading={isLoading}
        securityState={securityState}
        onBack={handleBack}
        onPinChange={handlePinChange}
        onPinComplete={handlePinComplete}
      />
    );
  }

  if (currentStep === "TRANSFER_COMPLETE") {
    return (
      <TransferComplete
        displayAmount={displayAmount}
        selectedProductsCount={selectedProducts.length}
        calculatedTotal={calculatedTotal}
        onBack={handleBack}
      />
    );
  }

  return null;
}
