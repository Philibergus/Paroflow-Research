import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paroflow - Gestion de Cabinet Dentaire',
  description: 'Système de gestion pour cabinet dentaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}