import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <header className="bg-primary py-4 text-primary-foreground">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold">
              リポジトリ検索
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] flex-grow px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-primary py-4 text-primary-foreground">
          <div className="mx-auto px-4 text-center sm:px-6 lg:px-8">
            <p>&copy; 2024 GitHub リポジトリ検索. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
