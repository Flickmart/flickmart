import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Delivery from "@/components/Delivery";
import SearchBox from "@/components/SearchBox";
import MobileNav from "@/components/MobileNav";
import Loader from "@/components/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Loader />
      <Navbar />
      <MobileNav />
      <SearchBox />
      {children}
      <Delivery />
      <Footer />
    </>
  );
}
