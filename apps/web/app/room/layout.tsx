
export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-dvh bg-background">
      {children}
    </div>
  );
}