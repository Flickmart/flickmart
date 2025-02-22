import AuthHeader from "@/components/auth/AuthHeader";
import Navbar from "@/components/Navbar";

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
        </>
    );
}