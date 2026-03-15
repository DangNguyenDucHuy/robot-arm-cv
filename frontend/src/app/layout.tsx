import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const mono = IBM_Plex_Mono({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	variable: '--font-mono'
})

const sans = IBM_Plex_Sans({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-sans'
})


export const metadata: Metadata = {
	title: 'Robot Arm CV',
	description: 'Real-time arm keypoint detection demo with ESP32-CAM and webcam support',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<body className="h-full overflow-hidden">{children}</body>
		</html>
	)
}
