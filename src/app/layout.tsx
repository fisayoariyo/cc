import type { Metadata } from 'next';
import './globals.css';
import logomark from '@/assets/CC Logomark.svg';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.charisconsult.com'),
  title: {
    default: 'Charis Consult',
    template: '%s | Charis Consult',
  },
  description:
    'Charis Consult helps clients with real estate, construction, study abroad, work abroad, and leisure travel support.',
  keywords: [
    'Charis Consult',
    'travel consultancy Nigeria',
    'study abroad Nigeria',
    'work abroad Nigeria',
    'real estate consultancy Nigeria',
    'construction consultancy Nigeria',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Charis Consult',
    description:
      'Real estate, construction, study abroad, work abroad, and leisure travel support from one consultancy.',
    url: 'https://www.charisconsult.com',
    siteName: 'Charis Consult',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charis Consult',
    description:
      'Real estate, construction, study abroad, work abroad, and leisure travel support from one consultancy.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
