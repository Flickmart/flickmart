import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import NavigationBar from "@/components/NavigationBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MobileHeader title="find category"/>
      {children}
    </>
  );
}
