import SilentErrorBoundary from "@/components/multipage/SilentErrorBoundary";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SilentErrorBoundary>{children}</SilentErrorBoundary>;
}
