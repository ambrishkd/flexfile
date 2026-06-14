import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
    title: "FileMorphix - Free Unlimited File Converter",
    description:
        "Convert images, audio, and video files for free. All processing happens locally on your device for enhanced privacy and security.",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen bg-background text-foreground">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
