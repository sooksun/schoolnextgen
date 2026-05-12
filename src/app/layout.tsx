import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AppToaster } from '@/lib/notify/Toaster'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-sans-thai',
  subsets: ['thai', 'latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SchoolNextgen — ศูนย์บัญชาการผู้ช่วยครู AI',
  description: 'ระบบบริหารโรงเรียนด้วยทีม AI Agent — ลดภาระเอกสาร เพิ่มเวลาให้ครู',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
