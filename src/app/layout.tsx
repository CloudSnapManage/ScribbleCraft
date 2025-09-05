import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "ScribbleCraft",
  description: "Turn your typed text into beautiful handwriting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Shadows+Into+Light&family=Patrick+Hand&family=Caveat&family=Dancing+Script&family=Kalam&family=Gaegu&family=Gochi+Hand&family=Handlee&family=Indie+Flower&family=Just+Me+Again+Down+Here&family=Marck+Script&family=Nanum+Pen+Script&family=Nothing+You+Could+Do&family=Permanent+Marker&family=Rock+Salt&family=Sue+Ellen+Francisco&family=Waiting+for+the+Sunrise&family=Zeyada&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
