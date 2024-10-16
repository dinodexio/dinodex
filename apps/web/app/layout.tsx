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
        style={{ background: "#FFF" }}
      >
        <CustomCursor />
        <div className="fixed bottom-0 left-0 right-0 top-0">
          <img
            src="/images/bg-web.png"
            alt="logo"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="relative z-10">
          <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>
        </div>
      </body>
    </html>
  );
}
