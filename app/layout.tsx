import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Larissa Soares | Senior Software Engineer",
  description:
    "Portfolio of Larissa Soares, a software engineer with 8 years of experience in React, Next.js, and React Native.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
