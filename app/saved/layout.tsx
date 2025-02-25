import AuthHeader from "@/components/auth/AuthHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <>
            <Navbar />
            <AuthHeader />
            {children}
            <Footer />
        </>
    );
}