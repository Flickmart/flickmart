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
      {children}
    </>
  );
}
