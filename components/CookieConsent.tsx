"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleCookieConsent(choice: "accept" | "reject") {
    localStorage.setItem("cookie-consent", choice);
    setVisible(false);

    if (choice === "accept") {
      console.log("Cookie accepted");
    } else {
      console.log("Cookie Rejected");
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent className="fixed left-[50%] top-[85%] lg:left-[85%]">
        <DialogHeader>
          <DialogTitle>Cookie Consent</DialogTitle>
          <DialogDescription>
            We use cookies to improve your experience. By using our site, you
            agree to our cookie policy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => handleCookieConsent("reject")}
          >
            Reject
          </Button>
          <Button onClick={() => handleCookieConsent("accept")}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
