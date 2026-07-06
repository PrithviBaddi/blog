import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Blog',
  description: 'A simple blog.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
