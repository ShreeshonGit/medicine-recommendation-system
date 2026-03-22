import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PulmoCare AI | Clinical Decision Support",
  description: "Advanced respiratory disease diagnosis and treatment prediction system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
