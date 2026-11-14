import { Bricolage_Grotesque, Inter, Kalam } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kalam",
  preload: false,
});

export const fontVariables = `${bricolage.variable} ${inter.variable} ${kalam.variable}`;
