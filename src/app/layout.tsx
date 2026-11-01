import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SONARGAON INTERNATIONAL SCHOOL | Building Character. Inspiring Excellence.',
  description:
    'Premier English Medium International School (Grades 1–10) in Dhaka, Bangladesh. Integrated Academic ERP, Admissions, and Scholastic Portals.',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-warmIvory text-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
