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
      <NavigationBar />
      {children}
    </>
  );
}
