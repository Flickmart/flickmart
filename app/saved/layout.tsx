import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavigationBar";
import MobileHeader from "@/components/MobileHeader";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MobileHeader title="saved"/>
      {children}
    </>
  );
}
