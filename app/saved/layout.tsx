import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavigationBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
