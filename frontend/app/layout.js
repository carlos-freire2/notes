import './globals.css'

export const metadata = {
  title: 'FSAB Notes',
  description: 'Simple note-taking app for FSAB bootcamp',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
