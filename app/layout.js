import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "Admin Panel",
  description: "Next.js + Tailwind Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Import Poppins from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
