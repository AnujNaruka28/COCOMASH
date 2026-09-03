import CommonCTA from "@/components/common/CommonCTA";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex bg-background h-full">            
        <div className="flex-2">
            <CommonCTA />
        </div>
        
        {children}
    </section>
  );
}