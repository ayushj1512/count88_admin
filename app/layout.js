export const metadata = {
  title: "Next.js Tailwind Starter",
  description: "A minimal Next.js + Tailwind setup in JavaScript",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
