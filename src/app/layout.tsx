import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import HoverBar from "@/components/hover-bar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mail Assistant ᴀɪ",
  description: "Concept by Yassine Annagrebah",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en" className={cn(poppins.variable, GeistSans.variable)}>
          <body className="flex min-h-screen flex-col bg-purple-100 dark:bg-[#121212]">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delayDuration={0}>
                <HoverBar />
                {children}
                <Toaster richColors />
              </TooltipProvider>
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
