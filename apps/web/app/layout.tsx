"use client";
import "./globals.css";
import { cn } from "@/lib/utils";
import AsyncLayoutDynamic from "@/containers/async-layout-dynamic";
import CustomCursor from "@/components/ui/CustomCursor";
import '../components/style.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn("h-full bg-background font-sans antialiased")}
        style={{ background: "#FFFBF7" }}
      >
        {/* <CustomCursor /> */}
        <div className="relative z-10">
          <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>
        </div>
      </body>
    </html>
  );
}
