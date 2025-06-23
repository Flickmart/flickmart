import {
  EmailCodeFactor,
  SessionVerificationLevel,
  SessionVerificationResource,
} from "@clerk/types";
import React, { useEffect, useRef, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSession } from "@clerk/clerk-react";
import { toast } from "sonner";

interface VerificationType {
  onDialogClose: () => void;
  onComplete: () => void;
  onCancel: () => void;
  level: SessionVerificationLevel | undefined;
}

export default function VerificationComponent({
  onDialogClose,
  onComplete,
  onCancel,
  level = "first_factor",
}: VerificationType) {
  const { session } = useSession();
  const [code, setCode] = useState<string>("");
  const [startingFirstFactor, setStartingFirstFactor] = useState<
    EmailCodeFactor | undefined
  >(undefined);
  const reverificationRef = useRef<SessionVerificationResource | undefined>(
    undefined
  );

  useEffect(() => {
    if (reverificationRef.current) {
      return;
    }

    // Start verification to get the Verification Resource and save it to the ref hook
    session?.startVerification({ level }).then(async (response) => {
      reverificationRef.current = response;
      await sendVerificationEmail(response);
    });
  }, []);

  // Send Verification Code after getting Verification Resource
  async function sendVerificationEmail(
    verificationResource: SessionVerificationResource
  ) {
    if (verificationResource.status === "needs_first_factor") {
      const startingFirstFactor =
        verificationResource.supportedFirstFactors?.filter(
          (factor) => factor.strategy === "email_code"
        )[0];

      if (startingFirstFactor) {
        setStartingFirstFactor(startingFirstFactor);

        await session?.prepareFirstFactorVerification({
          strategy: startingFirstFactor.strategy,
          emailAddressId: startingFirstFactor.emailAddressId,
        });
      }
    }
  }

  // Verification of Code
  const handleVerificationAttempt = async () => {
    try {
      // Attempt to verify the session using the email code
      await session?.attemptFirstFactorVerification({
        strategy: "email_code",
        code,
      });
      toast.success("Account verified successfully");
      onComplete();
      onDialogClose();
    } catch (err) {
      // Any error that occurs during verification
      toast.error("Error verifying session");
    }
  };

  return (
    <DialogContent className="w-[90vw] sm:w-[400px] rounded-lg">
      <DialogHeader className="space-y-3">
        <DialogTitle>Re-Verify Your Account</DialogTitle>
        <DialogDescription>
          To perform this action, enter verification code sent to
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center">
        <Input
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification Code"
          className="w-3/4"
        />
      </div>
      <DialogFooter>
        <div className="flex justify-center gap-3">
          <Button onClick={handleVerificationAttempt} className="w-1/3">
            Verify
          </Button>
          <Button
            className="w-1/3"
            variant="outline"
            onClick={() => {
              onDialogClose();
              onCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
