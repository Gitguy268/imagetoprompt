import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ImageToPrompt',
  description: 'Turn images into structured prompt packs with analysis, scoring, and exports.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
