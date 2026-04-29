import './globals.css';

export const metadata = {
  title: 'Form',
  description: 'Simple validation form',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

