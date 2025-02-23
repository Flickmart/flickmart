export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="!shadow-lg shadow-black/20 h-20 w-full">heelo</header>
      {children}
    </>
  );
}
