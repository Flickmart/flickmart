// import AuthHeader from "@/components/auth/AuthHeader";
import MobileHeader from "@/components/MobileHeader";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "gray",
            color: "white",
            textTransform: "capitalize",
          },
        }}
      />
      <MobileHeader title="Back" />
      {children}
    </>
  );
}
