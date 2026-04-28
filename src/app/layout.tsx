import type { Metadata } from 'next';
import './globals.css';
import logomark from '@/assets/CC Logomark.svg';

export const metadata: Metadata = {
  title: {
    default: 'Charis Consult',
    template: '%s | Charis Consult',
  },
  description:
    'Real estate, construction, and travel consultancy - your property, your journey, one consultant.',
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
