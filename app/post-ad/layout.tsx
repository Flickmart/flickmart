import AuthHeader from "@/components/auth/AuthHeader";
// import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
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
      {/* <Loader /> */}
      <Navbar />
      <AuthHeader />
      {children}
    </>
  );
}
