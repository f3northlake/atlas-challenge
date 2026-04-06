import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas Challenge | F3 Northlake',
  description: 'Log your daily Atlas Challenge points — F3 Northlake',
};

export const viewport: Viewport = {
  themeColor: '#1B2A4A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        {/* suppressHydrationWarning prevents false positives from browser extensions injecting src attrs */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
      </head>
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        {/* Top nav */}
        <header className="bg-f3navy text-white sticky top-0 z-20 shadow-md">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-f3yellow font-black text-xl tracking-tight">F3</span>
              <span className="font-semibold text-sm leading-tight">
                Atlas<br />
                <span className="text-gray-300 text-xs font-normal">Challenge</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-f3yellow transition-colors">Log</Link>
              <Link href="/leaderboard" className="hover:text-f3yellow transition-colors">Leaderboard</Link>
              <Link href="/admin" className="hover:text-f3yellow transition-colors">Admin</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-5">
          {children}
        </main>
      </body>
    </html>
  );
}
