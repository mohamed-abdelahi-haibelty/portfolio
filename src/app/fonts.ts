import localFont from "next/font/local";

// Google's latin files trimmed to the site's weights, features and characters
// by scripts/subset-fonts.py (~64 KB instead of ~115 KB). Same outlines.

export const bricolage = localFont({
  src: [{ path: "../assets/fonts/bricolage-latin.woff2", weight: "700 800", style: "normal" }],
  display: "swap",
  variable: "--font-bricolage",
  fallback: ["system-ui", "sans-serif"],
});

export const inter = localFont({
  src: [{ path: "../assets/fonts/inter-latin.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "sans-serif"],
});

export const kalam = localFont({
  src: [
    { path: "../assets/fonts/kalam-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/kalam-700-latin.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-kalam",
  fallback: ["cursive"],
  preload: false,
});

export const fontVariables = `${bricolage.variable} ${inter.variable} ${kalam.variable}`;
