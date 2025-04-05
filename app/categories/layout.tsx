import Navbar from "@/components/Navbar";
import NavigationBar from "@/components/NavigationBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden lg:block w-full mb-14">
        <Navbar />
      </div>
      {children}
    </>
  );
}
