import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// ── Sans-serif: clean, legible UI font ─────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BarberBook Studio",
  description: "Barbería premium en Ciudad de México. Reserva tu cita online.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      {/*
        Cormorant Garamond — editorial serif for headlines.
        Loaded via Google Fonts link tag for best FOUT handling with a serif face.
      */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0B0C] text-[#F3EDE2]">
        {children}
      </body>
    </html>
  )
}
