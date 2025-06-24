"use client"

import Footer from "@/components/Footer";
import React from "react";
const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden">
      {children}
      <Footer />
    </div>
  );
};

export default ContactLayout;
