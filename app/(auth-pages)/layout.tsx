import Footer from "@/components/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="">{children }   <Footer /></div>;
}
