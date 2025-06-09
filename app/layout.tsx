import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/lib/session-context"
import { Toaster } from "@/components/ui/toaster";
import { StagewiseToolbar } from '@stagewise/toolbar-next';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Snipiq",
  description: "Upload your code and unlock insights through search, chat, summarize, and visualize.",  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <StagewiseToolbar
              config={{
                plugins: [], // Add your custom plugins here
              }}
            />
            {children}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
