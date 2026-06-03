"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch - only render theme-dependent UI after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-background backdrop-blur-sm border-border">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo + site name */}
                <div className="flex items-center gap-2.5">
                    {mounted ? (
                        <Image
                            src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
                            alt="FlexFile logo"
                            width={28}
                            height={28}
                            priority
                        />
                    ) : (
                        <div className="w-7 h-7" />
                    )}
                    <span className="font-bold text-xl text-foreground tracking-tight">
                        FlexFile
                    </span>
                </div>

                {/* Dark / light mode toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                    {mounted ? (
                        theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </button>
            </div>
        </nav>
    );
}
