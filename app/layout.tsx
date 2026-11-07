import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Новогодняя игра-поздравление",
  description: "Персональная новогодняя игра-открытка для близких",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Playfair+Display:wght@600;800&display=swap"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
