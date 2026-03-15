'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { StreamViewport } from '@/components/stream/StreamViewport'
import { useStream } from '@/hooks/useStream'
import { useKeypoints } from '@/hooks/useKeypoints'
import { useMetadata } from '@/hooks/useMetadata'

export default function DashboardPage() {
	const stream = useStream()

	const { keypoints, fps, online: kpOnline } = useKeypoints(
		stream.active,
		stream.mode === 'ai',
	)

	const { metadata, online: metaOnline } = useMetadata(stream.active)

	const backendOnline = kpOnline && metaOnline
	const displayFps = fps > 0 ? fps : (metadata?.fps ?? 0)

	return (
		<div className="flex flex-col h-full bg-ink-900">

			<Header
				mode={stream.mode}
				status={stream.status}
				fps={displayFps}
			/>

			<div className="flex flex-1 overflow-hidden">

				<Sidebar
					url={stream.url}
					active={stream.active}
					mode={stream.mode}
					status={stream.status}
					metadata={metadata}
					fps={displayFps}
					backendOnline={backendOnline}
					onUrlChange={stream.setUrl}
					onStart={stream.start}
					onStop={stream.stop}
					onModeChange={stream.setMode}
				/>

				{/* ── Main viewport ── */}
				<main className="flex-1 flex items-center justify-center p-6 bg-ink-950 overflow-hidden relative">
					{/* Subtle dot grid on the main bg */}
					<div className="absolute inset-0 bg-grid-ink bg-grid-sm opacity-40 pointer-events-none" />

					<StreamViewport
						src={stream.activeSrc}
						active={stream.active}
						mode={stream.mode}
						status={stream.status}
						keypoints={keypoints}
						fps={displayFps}
						streamUrl={stream.url}
						backendOnline={backendOnline}
						onLoad={stream.onLoad}
						onError={stream.onError}
					/>
				</main>

			</div>
		</div>
	)
}
