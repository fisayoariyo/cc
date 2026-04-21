import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import logomark from '@/assets/CC Logomark.svg';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DotCharis Consult',
    template: '%s | DotCharis Consult',
  },
  description:
    'Real estate, construction, and travel consultancy — your property, your journey, one consultant.',
  icons: {
    icon: [{ url: logomark.src, type: 'image/svg+xml' }],
    shortcut: [{ url: logomark.src, type: 'image/svg+xml' }],
    apple: [{ url: logomark.src, type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>{children}</body>
    </html>
  );
}
