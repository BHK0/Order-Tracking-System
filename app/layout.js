import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff", 
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono", 
  weight: "100 900",
});

export const metadata = {
  title: 'HARIR - Track Order Status',
  description: 'Track your order status with HARIR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={geistSans.variable}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
