import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restreamer',
  description: 'Restreamer - Video-Streaming',
  themeColor: '#282728',
  icons: {
	icon: '/favicon.ico',
	apple: '/logo192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
	  <html lang="en">
		<body>
		  <div id="root">{children}</div>
		</body>
	  </html>
	);
}
